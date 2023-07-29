import requests

from adapters.b3.typing import time_T

# docs can be found at
# https://brapi.dev/docs


def available_stocks(search: str = None) -> list[str]:
    return ["AALR3", "TRIG11", "BEES4F", "WHRL3"]


def stock_details(stock: list[str], range: time_T, interval: time_T):
    return {
        "results": [
            {
                "currency": "BRL",
                "twoHundredDayAverage": 22.09155,
                "twoHundredDayAverageChange": 2.10845,
                "twoHundredDayAverageChangePercent": 0.09544146,
                "marketCap": 2857536000,
                "shortName": "ALLIAR      ON      NM",
                "longName": "Centro de Imagem Diagnósticos S.A.",
                "regularMarketChange": -0.0099983215,
                "regularMarketChangePercent": -0.041298315,
                "regularMarketTime": "2023-07-28T20:06:00.000Z",
                "regularMarketPrice": 24.2,
                "regularMarketDayHigh": 24.2,
                "regularMarketDayRange": "24.08 - 24.2",
                "regularMarketDayLow": 24.08,
                "regularMarketVolume": 170500,
                "regularMarketPreviousClose": 24.21,
                "regularMarketOpen": 24.1,
                "averageDailyVolume3Month": 314047,
                "averageDailyVolume10Day": 554420,
                "fiftyTwoWeekLowChange": 5.0600014,
                "fiftyTwoWeekLowChangePercent": 0.2643679,
                "fiftyTwoWeekRange": "19.14 - 24.22",
                "fiftyTwoWeekHighChange": -0.01999855,
                "fiftyTwoWeekHighChangePercent": -0.000825704,
                "fiftyTwoWeekLow": 19.14,
                "fiftyTwoWeekHigh": 24.22,
                "symbol": "AALR3",
                "historicalDataPrice": [
                    {
                        "date": 1690574760,
                        "open": 24.100000381469727,
                        "high": 24.200000762939453,
                        "low": 24.079999923706055,
                        "close": 24.200000762939453,
                        "volume": 170500,
                        "adjustedClose": 24.200000762939453,
                    }
                ],
                "validRanges": [
                    "1d",
                    "5d",
                    "1mo",
                    "3mo",
                    "6mo",
                    "1y",
                    "2y",
                    "5y",
                    "10y",
                    "ytd",
                    "max",
                ],
                "validIntervals": [
                    "1m",
                    "2m",
                    "5m",
                    "15m",
                    "30m",
                    "60m",
                    "90m",
                    "1h",
                    "1d",
                    "5d",
                    "1wk",
                    "1mo",
                    "3mo",
                ],
            }
        ],
        "requestedAt": "2023-07-29T00:29:43.262Z",
    }
