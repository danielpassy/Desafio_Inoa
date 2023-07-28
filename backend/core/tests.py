from datetime import timedelta
from core.models import Asset, UserAlert
from core.views import AlertForm


def test_list_assets(client_with_user):
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


def test_create_alert(client_with_user):
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


def test_update_available_stocks():
    