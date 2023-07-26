from typing import Literal

time_T = Literal["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]

# API deles tá bugada, não aceita valores menores que 1d
# range_T = Literal[
#     "1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"
# ]
