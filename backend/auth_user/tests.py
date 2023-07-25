from auth_user.models import User
from auth_user.views import RegisterForm, register


def test_sucesfully_register(client):
    form = RegisterForm(email="email@email.com", password="fakepassword")

    client.post("/api/auth/register", form.dict(), content_type="application/json")
    user = User.objects.get(email=form.email)

    assert user.email == form.email
    assert user.check_password(form.password)


def test_sucesfully_login(client):
    form = RegisterForm(email="email@email.com", password="fakepassword")
    User.objects.create_user(
        username=form.email, email=form.email, password=form.password
    )

    res = client.post("/api/auth/login", form.dict(), content_type="application/json")

    assert res.status_code == 200
    assert res.cookies["sessionid"]
