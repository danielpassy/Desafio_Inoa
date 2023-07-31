import os

from celery import Celery
from django.conf import settings
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
    from core.tasks import update_available_stocks, update_stock_details

    sender.add_periodic_task(
        crontab(minute="*/5", hour="9-18"), update_stock_details.s()
    )
    sender.add_periodic_task(
        crontab(minute="0", hour="10"), update_available_stocks.s()
    )
