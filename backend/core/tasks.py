from celery import shared_task
from django.utils import timezone

# to register a periodic task
# also register at backend.celery_settings


@shared_task
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


@shared_task
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


@shared_task
def warn_user():
    from core.models import UserAlert
    from django.db.models import Max, F
    from core.models import AssetRecord
    from adapters import email

    alerts = UserAlert.objects.select_related("asset", "user").all()
    assets_monitored = {a.asset_id for a in alerts}

    last_records = (
        AssetRecord.objects.filter(asset_id__in=assets_monitored)
        .annotate(max_measured_at=Max("measured_at"))
        .filter(max_measured_at=F("measured_at"))
    )
    last_record_per_asset = {
        last_record.asset_id: last_record for last_record in last_records
    }

    for alert in alerts:
        if alert.last_checked and (
            timezone.now() - alert.last_checked <= alert.interval
        ):
            continue

        last_record = last_record_per_asset.get(alert.asset_id)
        if last_record is None:
            continue

        if (
            last_record.price > alert.inferior_tunel
            and last_record.price < alert.superior_tunel
        ):
            alert.last_checked = timezone.now()
            continue

        should_sell = True if last_record.price > alert.superior_tunel else False
        try:
            email.send_email(
                template="sell_stock" if should_sell else "buy_stock",
                email=alert.user.email,
                price=f"{last_record.currency} {last_record.price/100}",
                stock_symbol=alert.asset.symbol,
            )
            alert.last_checked = timezone.now()
        except Exception as e:
            pass

    UserAlert.objects.bulk_update(alerts, ["last_checked"])
