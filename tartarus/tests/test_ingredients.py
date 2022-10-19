import tartarus.ingredients

def test_get_all(client,app,auth):
    token = auth.login()
    res = client.get('/ingredients/', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['ingredients']) > 0
    assert res.json['ingredients'][0]['IngredientId'] != None

def test_get_id(client,auth):
    token = auth.login()
    res = client.get('/ingredients/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    print(res.json['ingredient'])
    assert res.json['ingredient']['IngredientId'] == 1

def test_get_types(client, auth):
    token = auth.login()
    res = client.get('/ingredients/kind', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['kinds']) > 0
    assert res.json['kinds']['MILK'] == 1

def test_get_ingredient_by_type(client, auth):
    token = auth.login()
    res = client.get('/ingredients/kind/MILK', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['ingredients']) > 0
    assert res.json['ingredients'][0]['Kind'] == 'MILK'

def test_create_ingredient(client,auth):
    token = auth.login()
    test_ingredient = {
        "Name":"TestIngredient",
        "Kind":"ADDIN",
        "Price":0.99,
        "Stock":420,
        "Upcharge":0.42
    }
    res = client.post('/ingredients/create', headers={'Authorization':f'Bearer {token}'}, json=test_ingredient)
    assert res.status_code == 200
    print(res.json)
    for key in test_ingredient:
        assert test_ingredient[key] == res.json['ingredient'][key]
    assert res.json['ingredient']['IngredientId'] != 0

