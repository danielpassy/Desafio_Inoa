import requests

from adapters.b3.typing import time_T

# docs can be found at
# https://brapi.dev/docs


def available_stocks(search: str | None = None) -> list[str]:
    return ["AALR3", "TRIG11", "BEES4F", "WHRL3"]


def stock_details(stocks: list[str], range: time_T, interval: time_T):
    return {
        stock: {
            "currency": "BRL",
            "price": 24.20,
        }
        for stock in stocks
    }
