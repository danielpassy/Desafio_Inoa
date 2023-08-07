from django.core.mail import send_mail
from django.conf import settings


def send_email(msg, email, subject):
    send_mail(
        subject=msg,
        message=subject,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
    )
