from celery import Celery
from django.conf import settings

app = Celery("tasks", broker=settings.RABBITMQ_HOST)


@app.task
def add(x, y):
    return x + y
