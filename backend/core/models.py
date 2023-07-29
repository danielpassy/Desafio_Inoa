from django.db import models

from auth_user.models import User


class Asset(models.Model):
    name = models.TextField(null=True)
    short_name = models.TextField(null=True)  # "PETROBRAS   PN      N2"
    long_name = models.TextField(null=True)  # "Petróleo Brasileiro S.A. - Petrobras"
    symbol = models.TextField()  # "PETR4"


class UserAlert(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    inferior_tunel = models.IntegerField()
    superior_tunel = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interval = models.DurationField()


class Currency(models.TextChoices):
    REAL = "BRL"
    AMERICAN_DOLAR = "US"


class AssetRecord(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.DO_NOTHING)
    price = models.IntegerField()
    currency = models.TextField(choices=Currency.choices)
    measured_at = models.DateTimeField()

    class meta:
        orderering = ["-measure_at"]
