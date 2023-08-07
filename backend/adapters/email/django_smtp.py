from django.core.mail import send_mail
from django.conf import settings


def send_email(msg, email, subject):
    return send_mail(
        subject=subject,
        message="",
        html_message=msg,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
    )
