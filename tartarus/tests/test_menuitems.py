from tartarus.models.MenuItem import MenuItem

def test_get_all(client,auth):
    token = auth.login()
    res = client.get('/menuitems/', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['menuitems']) > 0
    assert res.json['menuitems'][0]['MenuId'] != None

def test_get_id(client,auth):
    token = auth.login()
    res = client.get('/menuitems/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['menuitem']['MenuId'] == 1

def test_get_active(client, auth):
    token = auth.login()
    res = client.get('/menuitems/active', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['menuitems']) > 0
    assert res.json['menuitems'][0]['Active'] == True

def test_activate(client, auth, app):
    with app.app_context():
        inactiveId = MenuItem.fromRecipe({"1":100}).getId()
    token = auth.login()
    res = client.get('/menuitems/activate/'+str(inactiveId), headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['menuitem']['Active'] == True

def test_deactivate(client,auth,app):
    with app.app_context():
        activeId = MenuItem.fromRecipe({"1":1}).getId()
    token = auth.login()
    res = client.get('/menuitems/deactivate/'+str(activeId), headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['menuitem']['Active'] == False

def test_get_recipe(client,auth):
    token = auth.login()
    res = client.get('/menuitems/recipe/{"1":50,"2":100}', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['menuitem']['Recipe'] == {'1':50, '2':100}
    assert res.json['menuitem']['ImagePath']

def test_update_ingredient(client,auth):
    token = auth.login()
    test_item = {
        "Name":"TestMenuItem",
        "Recipe":{'2':2,'3':3,'4':4},
        "Active":420,
        "ImagePath":0.42
    }
    res = client.post('/menuitems/update', headers={'Authorization':f'Bearer {token}'}, json=test_item)
    assert res.status_code == 200
    print(res.json)
    for key in test_item:
        assert test_item[key] == res.json['menuitem'][key]
    assert res.json['menuitem']['MenuId'] != 0

