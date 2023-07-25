from .views import core_api
from django.urls import path

urlpatterns = [
    path("", core_api.urls),
]
