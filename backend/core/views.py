import datetime
from django.forms import model_to_dict
from ninja import NinjaAPI, Schema
from pydantic import validator
from ninja.security import django_auth
from core.models import Asset, AssetRecord, UserAlert

core_api = NinjaAPI(urls_namespace="core", auth=django_auth, csrf=True)


class LoginForm(Schema):
    email: str
    password: str


class Assets(Schema):
    assets: str


class Error(Schema):
    error: str


class AssetFilter(Schema):
    ids: list[str] | None
    initial_date: datetime.date | None
    end_date: datetime.date | None

    @validator("initial_date", pre=True)
    @classmethod
    def validate_x(cls, v):
        if not v:
            return datetime.datetime.now() - datetime.timedelta(days=30)


@core_api.get("/assets", response={200: dict})
def list_assets(request, filters: AssetFilter | None = None):
    if not filters:
        filters = AssetFilter()

    assets = Asset.objects.all()
    if filters.ids:
        assets = assets.filter(id__in=filters.ids)
    if filters.initial_date:
        assets = assets.filter(date__gte=filters.initial_date)
    if filters.end_date:
        assets = assets.filter(date__lte=filters.end_date)

    return 200, {"assets": [model_to_dict(a) for a in assets]}


@core_api.get("/alerts", response={200: dict})
def list_alerts(request):
    user = request.user
    alerts = UserAlert.objects.filter(user=user)

    return 200, {
        "alerts": [
            {
                **model_to_dict(a),
                "asset": {**model_to_dict(a.asset)},
            }
            for a in alerts
        ]
    }


@core_api.delete("/alerts/{alert_id}", response={204: dict})
def delete_alert(request, alert_id: int):
    user = request.user
    alerts = UserAlert.objects.filter(id=alert_id)

    if not alerts or alerts[0].user != user:
        return 403, {"error": "User has no permission to delete this alert"}

    alerts[0].delete()

    return 204, {}


class AlertForm(Schema):
    asset_id: str
    inferior_tunel: int
    superior_tunel: int
    interval: datetime.timedelta


@core_api.post("/alerts", response={201: dict, 200: dict})
def create_alerts(request, data: AlertForm):
    user = request.user

    alert, created = UserAlert.objects.select_related("asset").update_or_create(
        asset_id=data.asset_id, user=user, defaults=data.dict()
    )

    return 201 if created else 200, {
        "alert": {
            "asset": {**model_to_dict(alert.asset)},
            **model_to_dict(alert),
        }
    }


@core_api.get("/assets/{asset_id}", response={200: dict})
def get_asset(request, asset_id: str, initial_date: str):
    records = AssetRecord.objects.filter(
        asset_id=asset_id,
        measured_at__gte=initial_date,
    )

    return 200, {"records": [model_to_dict(r) for r in records]}
