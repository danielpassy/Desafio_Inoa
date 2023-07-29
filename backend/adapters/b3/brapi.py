import requests

from adapters.b3.typing import time_T

# docs can be found at
# https://brapi.dev/docs


def available_stocks(search: str | None = None) -> list[str]:
    params = {
        "search": search,
    }
    response = requests.get(f"https://brapi.dev/api/available", params=params)
    response.raise_for_status()

    return response.json()["stocks"]


def stock_details(
    stocks: list[str], range: time_T, interval: time_T
) -> dict[str, dict]:
    params = {
        "range": range,
        "interval": interval,
    }
    response = requests.get(f"https://brapi.dev/api/quote/{stocks}", params=params)
    response.raise_for_status()

    return {
        stock["symbol"]: {
            "price": stock["historicalDataPrice"]["close"],
            "currency": stock["currency"],
        }
        for stock in response.json()["results"]
    }
