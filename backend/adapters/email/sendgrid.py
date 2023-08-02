# using SendGrid's Python Library

# https://github.com/sendgrid/sendgrid-python

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, Subject

client = SendGridAPIClient(settings.ADAPTERS_KEY["EMAIL"]["SENDGRID_API_KEY"])


def send_email(msg, email, subject):
    message = Mail(
        from_email=Email("daniel.passy@gmail.com"),
        to_emails=To(email),
        subject=Subject(subject),
        html_content=Content("text/plain", msg),
    )
    response = client.send(message)
    response.raise_for_status()  # type: ignore
