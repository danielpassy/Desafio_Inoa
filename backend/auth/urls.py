from django.urls import path
from .views import auth_api

urlpatterns = [
    path("", auth_api.urls),
]
