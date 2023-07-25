from ninja import NinjaAPI, Schema
from django.contrib.auth import authenticate, login as django_login

from auth_user.models import User

auth_api = NinjaAPI(urls_namespace="auth")


class LoginForm(Schema):
    email: str
    password: str


class Message(Schema):
    message: str


class Error(Schema):
    error: str


@auth_api.post("/login", response={200: Message, 401: Error})
def login(request, data: LoginForm):
    user = authenticate(request, email=data.email, password=data.password)
    if user is None:
        return 401, {"error": "Invalid credentials"}

    django_login(request, user)
    return 200, {"message": "Logged in"}


class RegisterForm(Schema):
    email: str
    password: str


@auth_api.post("/register", response={201: Message, 401: Error})
def register(request, data: RegisterForm):
    already_registered_user = User.objects.filter(email=data.email).first()
    if already_registered_user:
        return 401, {"error": "Email already used"}

    user = User.objects.create_user(
        username=data.email, email=data.email, password=data.password
    )
    django_login(request, user=user)
    return 201, {"message": "User sucessfully created"}
