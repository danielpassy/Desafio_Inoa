from importlib import import_module
from django.conf import settings
from .typing import email_template_T

adapter = import_module(settings.ADAPTERS["EMAIL"])


def send_email(
    template: email_template_T,
    email: str,
    person_email: str,
    price: float,
    stock_symbol: str,
):
    msg = available_templates[template].format(
        person_email=person_email,
        price=price,
        stock_symbol=stock_symbol,
    )
    subject = f"Stock {stock_symbol} reached {price}"
    return adapter.send_email(msg, email, subject)


available_templates = {
    "sell_stock_template": """Dear {person_email},

This is a notification to inform you that the stock price for {stock_symbol} has reached {price}, above to the superior tunel.

Thank you for using our service.

Best regards,
Inoa Company

Manage your alerts at https://inoa.com/alerts""",
    "buy_stock_template": """Dear {person_email},

This is a notification to inform you that the stock price for {stock_symbol} has reached {price}, below to the inferior tunel.

Thank you for using our service.

Best regards,
Inoa Company
Manage your alerts at https://inoa.com/alerts""",
}
