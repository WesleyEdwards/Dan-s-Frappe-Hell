from tartarus.models.Ingredient import Ingredient
from tartarus.models.MenuItem import MenuItem
from tartarus.models.Balance import Balance
from tartarus.models.Order import Order

def test_get_all(client,auth):
    token = auth.login()
    res = client.get('/orders/', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['orders']) > 0
    assert res.json['orders'][0]['OrderId'] != None

def test_get_id(client,auth):
    token = auth.login()
    res = client.get('/orders/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['order']['OrderId'] == 1

def test_get_state(client, auth):
    token = auth.login()
    res = client.get('/orders/status/CART', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['orders']) > 0
    assert res.json['orders'][0]['Status'] == "CART"

def test_get_all_of_user(client, auth):
    token = auth.login()
    res = client.get('/orders/user/1', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['orders']) > 0
    assert res.json['orders'][0]['UserId'] == 1

def test_get_favorite_of_user(client, auth):
    token = auth.login()
    res = client.get('/orders/user/1/favorites', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert len(res.json['orders']) > 0
    assert res.json['orders'][0]['UserId'] == 1
    assert res.json['orders'][0]['Favorite'] == True

def test_get_cart_of_user(client, auth):
    token = auth.login()
    res = client.get('/orders/user/1/cart', headers={'Authorization':f'Bearer {token}'})
    assert res.status_code == 200
    assert res.json['order']['UserId'] == 1
    assert res.json['order']['Status'] == "CART"

def test_update_order(client,auth,app):
    token = auth.login()
    test_order = {
        "OrderId":1,
        "Favorite":False,
        "Items":[{"menuId":1,"quantity":1,"price":1},{"menuId":2,"quantity":2,"price":1}],
        "Status":"PLACED",
    }
    # Get pre balance info to make sure we updated correctly
    pre_storeBal = 0
    pre_userBal = 0
    target_quantity = {}
    with app.app_context():
        storeBal = Balance.getStoreBalance()
        pre_storeBal = storeBal.getBalance()
        order = Order.fromID(1)
        userBal = Balance.fromUserID(order.getUserId())
        pre_userBal = userBal.getBalance()

        for item in test_order['Items']:
            menuitem = MenuItem.fromID(item["menuId"])
            for ing in menuitem.getRecipe():
                curr_qty = Ingredient.fromID(ing).getStock()
                if not target_quantity.get(ing,False):
                    target_quantity[ing] = curr_qty - (menuitem.getRecipe()[ing] *item["quantity"])
                else:
                    target_quantity[ing] -= (menuitem.getRecipe()[ing] *item["quantity"])
        
    res = client.post('/orders/update', headers={'Authorization':f'Bearer {token}'}, json=test_order)
    print(res.json)
    assert res.status_code == 200
    print(res.json)
    for key in test_order:
        assert res.json['order'][key] != None
        if key == "Items":
            def get_id(elem):
                return elem.get("menuId")
            test_items = sorted(test_order[key],key=get_id)
            res_items = sorted(res.json['order']['Items'],key=get_id)
            assert len(test_items) == len(res_items)
            for i in range(len(test_items)):
                assert test_items[i]["menuId"] == res_items[i]["menuId"]
                assert test_items[i]["quantity"] == res_items[i]["quantity"]
                assert res_items[i]["price"] > 0
        else:
            assert test_order[key] == res.json['order'][key]
    # Make sure Balances / stock are updated
    with app.app_context():
        storeBal = Balance.getStoreBalance()
        order = Order.fromID(1)
        userBal = Balance.fromUserID(order.getUserId())
        storeDif = round(storeBal.getBalance() - pre_storeBal,2)
        custDif = round(pre_userBal - userBal.getBalance(),2)
        assert storeDif == custDif == res.json['order']['TotalPrice']
        for ing in target_quantity:
            assert target_quantity[ing] == Ingredient.fromID(ing).getStock()

    
    assert res.json['order']['TotalPrice'] > 0

