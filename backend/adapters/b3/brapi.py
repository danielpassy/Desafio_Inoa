import requests
import urllib.parse
from adapters.b3.typing import time_T, stock_data_T

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
    stocks: list[str], initial_date: time_T, interval: time_T
) -> dict[str, dict]:
    batch_size = 40

    results = {}
    for i in range(0, len(stocks), batch_size):
        batch = stocks[i : i + batch_size]
        parcial_result = _stock_details(batch, initial_date, interval)
        results.update(parcial_result)
    return results


def _stock_details(
    stocks: list[str], initial_time: time_T, interval: time_T
) -> stock_data_T:
    params = {
        "range": initial_time,
        "interval": interval,
    }
    stock_symbol_separated_comma = ",".join(stocks)
    url_encoded = urllib.parse.quote(stock_symbol_separated_comma)

    response = requests.get(f"https://brapi.dev/api/quote/{url_encoded}", params=params)

    response.raise_for_status()
    res = {}
    for stock in response.json()["results"]:
        if not "error" in stock:
            res[stock["symbol"]] = {
                "price": stock["regularMarketPreviousClose"],
                "currency": stock["currency"],
            }
    return res
