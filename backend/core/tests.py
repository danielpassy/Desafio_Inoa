from core.models import Asset


def test_list_assets(client):
    asset = Asset.objects.create(
        name="123",
        short_name="123",
        long_name="123",
        symbol="123",
    )

    res = client.get("/api/assets")
    data = res.json()

    assert res.status_code == 200
    assert len(data["assets"]) == 1
    assert data["assets"][0]["id"] == asset.id
