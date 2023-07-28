# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery_settings import celery_instance as celery_app

__all__ = ("celery_app",)
