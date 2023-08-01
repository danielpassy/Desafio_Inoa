from importlib import import_module
from django.conf import settings
from .typing import time_T, stock_data_T

adapter = import_module(settings.ADAPTERS["B3"])


def available_stocks(search: str | None = None) -> list[str]:
    return adapter.available_stocks(search)


def stock_details(stocks: list[str], range: time_T, interval: time_T) -> stock_data_T:
    return adapter.stock_details(stocks, range, interval)
