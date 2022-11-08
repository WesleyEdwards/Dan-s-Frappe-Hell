import tartarus.auth

def test_get_token_happy(client, app):
    token_res = client.post(
            '/auth/token',
            json={'email':  'manager@dfh.com', 'password': 'password'}
        )
    assert token_res.status_code == 200
    assert token_res.json['token'] != None

def test_validate_token_happy(client, app):
    token = client.post(
            '/auth/token',
            json={'email':  'manager@dfh.com', 'password': 'password'}
        ).json['token']
    print(token)
    with app.app_context():
        assert tartarus.auth.check_token(token)[1]

def test_get_token_bad_email(client):
    token_res = client.post(
        '/auth/token',
        json={'email': 'wrong@example.com', 'password': 'password'}
    )
    assert token_res.status_code == 401
    assert  not token_res.json['token']
    assert not token_res.json['user']
    assert token_res.json['error'] == "Invalid Credentials"
    