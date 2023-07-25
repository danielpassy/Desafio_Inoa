import datetime
from django.forms import model_to_dict
from ninja import NinjaAPI, Schema
from django.contrib.auth.models import User

from core.models import Asset, UserAlert

core_api = NinjaAPI()


class LoginForm(Schema):
    email: str
    password: str


class Assets(Schema):
    assets: Asset


class Error(Schema):
    error: str


class AssetFilter(Schema):
    ids: list[str]
    initial_date: datetime.date | datetime.now() - datetime.timedelta(days=30)
    end_date: datetime.date | None


@core_api.get("/assets", response={200: Assets})
def assets(request, filters: AssetFilter):
    assets = Asset.objects.all()
    if filters.ids:
        assets = assets.filter(id__in=filters.ids)
    if filters.initial_date:
        assets = assets.filter(date__gte=filters.initial_date)
    if filters.end_date:
        assets = assets.filter(date__lte=filters.end_date)

    return 200, {"assets": model_to_dict(assets)}


@core_api.get("/alerts", response={200: UserAlert})
def alerts(request):
    user = request.user
    alerts = UserAlert.objects.filter(user=user)

    return 200, {"alerts": model_to_dict(alerts)}


@core_api.post("/alerts", response={201: UserAlert, 400: Error})
def create_alerts(request, alert_form: UserAlert):
    user = request.user
    alert = UserAlert.objects.filter(asset_id=alert_form.asset_id, user=user).first()
    if alert:
        alert(**alert_form.dict()).save()
        return 200, {"alert": model_to_dict(alert)}

    new_alert = UserAlert(user=user, **alert_form.dict())
    new_alert.save()

    return 201, {"alert": model_to_dict(new_alert)}
