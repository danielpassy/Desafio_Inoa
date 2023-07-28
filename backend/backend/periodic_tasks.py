from celery import shared_task
from .celery_settings import celery_instance
from celery.schedules import crontab


@shared_task
def debug():
    print("Hello World")


@celery_instance.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    celery_instance.add_periodic_task(crontab(minute="*/1"), debug.s())
