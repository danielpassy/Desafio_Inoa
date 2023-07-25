from auth_user.views import RegisterForm, register


def test_sucesfully_register(client, rf):
    form = RegisterForm(email="email@email.com", password="fakepassword")

    request = client.post("/auth/register", form.dict())
