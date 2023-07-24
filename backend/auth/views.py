from ninja import NinjaAPI, Schema
from django.contrib.auth import authenticate


auth_api = NinjaAPI()


class LoginForm(Schema):
    email: str
    password: str


@auth_api.post("/login")
def login(request, data: LoginForm):
    user = authenticate(request, email=data.email, password=data.password)
    if user is None:
        401, {"error": "Invalid credentials"}

    login(request, user)
    return 200, {"message": "Logged in"}


class RegisterForm(Schema):
    email: str
    password: str


@auth_api.post("/register")
def register(request, data: RegisterForm):
    user = User.objects.create_user(username=data.username, password=data.password)
    login(request, user)
    return 200, {"message": "Logged in"}
