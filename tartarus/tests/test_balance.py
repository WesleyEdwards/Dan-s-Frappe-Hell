from tartarus.balances import Balance
def test_get_id(client, auth):
    token = auth.login()
    res = client.get('/balance/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['balance'] != {}
    assert res.json['balance']['BalanceId'] == 1

def test_get_user(client,auth):
    token = auth.login()
    res = client.get('/balance/user/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['balance'] != {}
    assert res.json['balance']['UserId'] == 1

def test_get_store(client,auth):
    token = auth.login()
    res = client.get('/balance/store', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['balance'] != {}
    assert res.json['balance']['BalanceId'] == 1

def test_increment(client,auth, app):
    token = auth.login()
    total = -1
    amount = 5.45
    with app.app_context():
        total = Balance.getStoreBalance().getBalance()
    
    res = client.get(f'/balance/1/increment/{amount}', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['balance'] != {}
    assert res.json['balance']['Balance'] == (total + amount)
    with app.app_context():
        assert Balance.getStoreBalance().getBalance() == (total + amount)
