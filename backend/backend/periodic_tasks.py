from celery import shared_task

from core.tasks import update_available_stocks, update_stock_details
from .celery_settings import celery_instance
from celery.schedules import crontab


@celery_instance.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    celery_instance.add_periodic_task(
        crontab(minute="*/5", hour="9-18"), update_stock_details.s()
    )
    celery_instance.add_periodic_task(
        crontab(minute="0", hour="10"), update_available_stocks.s()
    )
