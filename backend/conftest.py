import pytest

from auth_user.models import User


@pytest.fixture(autouse=True)
def use_db(db):
    ...


@pytest.fixture()
def user():
    return User.objects.create_user(
        email="teste@teste.com.br", username="teste", password="teste"
    )


@pytest.fixture()
def client_with_user(user, client):
    client.force_login(user)
    return client
