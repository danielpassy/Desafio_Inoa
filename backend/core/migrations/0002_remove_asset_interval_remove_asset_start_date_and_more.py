# Generated by Django 4.2.3 on 2023-07-26 08:17

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="asset",
            name="interval",
        ),
        migrations.RemoveField(
            model_name="asset",
            name="start_date",
        ),
        migrations.AddField(
            model_name="useralert",
            name="interval",
            field=models.DurationField(default=datetime.timedelta(seconds=600)),
            preserve_default=False,
        ),
    ]
