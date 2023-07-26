from importlib import import_module
from typing import Dict, List
from django.conf import settings

adapter = import_module(settings.B3_ADAPTER)


def available_stocks(search) -> List[Dict]:
    return adapter.available_stocks(search)


def stock_details(stock, range, interval):
    return adapter.stock_details(stock, range, interval)
