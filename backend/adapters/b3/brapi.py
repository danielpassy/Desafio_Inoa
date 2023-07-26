import requests

from adapters.b3.typing import time_T

# docs can be found at
# https://brapi.dev/docs


def available_stocks(search: str) -> dict[str, any]:
    params = {
        "search": search,
    }
    response = requests.get(f"https://brapi.dev/api/available", params=params)
    response.raise_for_status()

    return response.json()


def stock_details(stock: list[str], range: time_T, interval: time_T):
    params = {
        "range": range,
        "interval": interval,
    }
    response = requests.get(f"https://brapi.dev/api/quote/{stock}", params=params)
    response.raise_for_status()

    return response.json()
