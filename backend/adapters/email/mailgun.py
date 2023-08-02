from django.conf import settings
import requests


def send_email(msg, email, subject):
    return requests.post(
        f"https://api.mailgun.net/v3/{settings.EMAIL_HOST}/messages",
        auth=("api", settings.ADAPTERS_KEY["EMAIL"]["MAILGUN_API_KEY"]),
        data={
            "from": f"Inoa <postmaster@{settings.EMAIL_HOST}>",
            "to": email,
            "subject": subject,
            "text": msg,
        },
    )
