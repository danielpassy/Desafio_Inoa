from adapters import b3
from core.models import Asset, AssetRecord


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


def update_stock_details():
    stocks = Asset.objects.all()
    stock_details = b3.stock_details(
        stocks=[stock.symbol for stock in stocks],
        range="1d",
        interval="1d",
    )
    stock_records = []
    for stock in stocks:
        stock_records.append(
            AssetRecord(
                asset=stock,
                price=stock_details[stock.symbol]["price"],
                currency=stock_details[stock.symbol]["currency"],
            )
        )
    AssetRecord.objects.bulk_create(stock_records)
