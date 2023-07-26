from importlib import import_module
from django.conf import settings
from .typing import time_T

adapter = import_module(settings.B3_ADAPTER)


def available_stocks(search: str = None) -> list[dict]:
    return adapter.available_stocks(search)


def stock_details(stock, range: time_T, interval: time_T) -> list[dict]:
    return adapter.stock_details(stock, range, interval)