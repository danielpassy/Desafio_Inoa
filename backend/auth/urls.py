from django.http import JsonResponse
from django.urls import include, path
from pydantic import BaseModel
from django.contrib.auth import authenticate, login


def login(request):
    login_form = LoginForm(**request.POST.dict())
    user = authenticate(
        request, username=login_form.username, password=login_form.password
    )
    if user is not None:
        login(request, user)
        return JsonResponse("Logged in")
    else:
        JsonResponse("Invalid credentials", status=401)


class LoginForm(BaseModel):
    password = str
    username = str


urlpatterns = [
    path("admin/", login),
]
