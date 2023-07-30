from datetime import timedelta
import numbers
from core import tasks
from core.models import Asset, AssetRecord, UserAlert
from core.views import AlertForm


def test_list_assets_retrieve_correct_asset(client_with_user):
    asset = Asset.objects.create(
        name="123",
        short_name="123",
        long_name="123",
        symbol="123",
    )

    res = client_with_user.get("/api/assets")
    data = res.json()

    assert res.status_code == 200
    assert len(data["assets"]) == 1
    assert data["assets"][0]["id"] == asset.id


def test_create_alert_creates_it(client_with_user):
    asset = Asset.objects.create(
        name="123",
        short_name="123",
        long_name="123",
        symbol="123",
    )
    form = AlertForm(
        asset_id=asset.id,
        inferior_tunel=10,
        superior_tunel=10,
        interval=timedelta(minutes=10),
    )

    res = client_with_user.post(
        "/api/alerts", form.dict(), content_type="application/json"
    )
    alert = UserAlert.objects.all().first()

    assert res.status_code == 201
    assert UserAlert.objects.count() == 1
    assert alert.asset_id == asset.id


def test_update_available_stocks_create_asset_entry():
    tasks.update_available_stocks()

    # b3 mock return 4 entries
    assert Asset.objects.count() == 4


def test_update_stock_details_create_correct_asset_record():
    asset_petr4 = Asset.objects.create(
        symbol="PETR4",
    )
    asset_vale3 = Asset.objects.create(
        symbol="VALE3",
    )

    tasks.update_stock_details()
    assetRecords = AssetRecord.objects.select_related("asset").all()
    records = {ar.asset.symbol: ar for ar in assetRecords}

    assert len(records) == 2
    assert records["PETR4"].asset == asset_petr4
    assert records["PETR4"].currency == "BRL"
    assert records["VALE3"].asset == asset_vale3
    assert isinstance(records["PETR4"].price, numbers.Number)


def test_get_stock_price_history(client_with_user):
    record = AssetRecord.objects.create(
        asset=Asset.objects.create(symbol="PETR4"),
        price=10,
        currency="BRL",
    )

    res = client_with_user.get(
        f"/api/assets/{record.asset.id}", {"initial_date": "2021-01-01"}
    )
    data = res.json()

    assert len(data["records"]) == 1
    assert data["records"][0]["asset"] == record.asset_id
    assert data["records"][0]["price"] == record.price
