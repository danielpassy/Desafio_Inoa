# Generated by Django 4.2.3 on 2023-07-25 23:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Asset",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.TextField()),
                ("short_name", models.TextField()),
                ("long_name", models.TextField()),
                ("symbol", models.TextField()),
                ("start_date", models.DateField(auto_now=True, null=True)),
                ("interval", models.DurationField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name="UserAlert",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("inferior_tunel", models.IntegerField()),
                ("superior_tunel", models.IntegerField()),
                (
                    "asset",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.asset"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AssetRecord",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("price", models.IntegerField()),
                (
                    "currency",
                    models.TextField(
                        choices=[("BRL", "Real"), ("US", "American Dolar")]
                    ),
                ),
                ("measured_at", models.DateTimeField()),
                (
                    "asset",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING, to="core.asset"
                    ),
                ),
            ],
        ),
    ]
