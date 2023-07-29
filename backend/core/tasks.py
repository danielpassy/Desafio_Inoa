from adapters import b3
from core.models import Asset


def update_available_stocks():
    stocks = b3.available_stocks()
    stock_list = []
    for stock_symbol in stocks:
        stock_list.append(Asset(symbol=stock_symbol))
    Asset.objects.bulk_create(
        stock_list,
        # update_conflicts=True,
        # unique_fields=["symbol"],
    )
