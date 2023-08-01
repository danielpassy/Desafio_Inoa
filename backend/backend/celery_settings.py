import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

celery_instance = Celery("backend")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
celery_instance.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
celery_instance.autodiscover_tasks()


@celery_instance.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(minute="*/1"), update_stock_details.s())
    sender.add_periodic_task(
        crontab(minute="0", hour="10"), update_available_stocks.s()
    )


@celery_instance.task()
def update_available_stocks():
    from adapters import b3
    from core.models import Asset

    print("update_available_stocks")
    stocks = b3.available_stocks()
    stock_list = []
    for stock_symbol in stocks:
        stock_list.append(Asset(symbol=stock_symbol))
    Asset.objects.bulk_create(
        stock_list,
        update_conflicts=True,
        unique_fields=["symbol"],
        update_fields=["name", "short_name", "long_name"],
    )


@celery_instance.task()
def update_stock_details():
    from adapters import b3
    from core.models import Asset, AssetRecord

    stocks = Asset.objects.all().in_bulk(field_name="symbol")
    stock_details = b3.stock_details(
        stocks=list(stocks.keys()),  # type: ignore
        range="1d",
        interval="1d",
    )
    stock_records = []
    for stock_symbol, price_data in stock_details.items():
        stock_records.append(
            AssetRecord(
                asset=stocks[stock_symbol],
                price=price_data["price"],
                currency=price_data["currency"],
            )
        )

    AssetRecord.objects.bulk_create(stock_records)
