# Tartarus API Documentation

## /auth

### /token

> Endpoint for Generating auth tokens. Accepts email and password. If valid, returns a token + user info, otherwise, error.
>
> Parameters accepted as JSON payload

METHODS: `POST`

Authentication Required: `NO`

Parameters:
- `'email'` -> Email of user logging in
- `'password'` -> plaintext password of user logging in

Returns
- On successful login:
```json
STATUS: 200
{
    "token":<signed-jwt>,
    "error":"",
    "user":User
}
```
- On failed login:
```json
STATUS:401
{
    "token":Null,
    "error":<str>,
    "user":Null
}
```

Related objects:

- [User](#user)

## /ingredients

### /

> Retrieves all ingredients

METHODS: `GET`

Authentication Required: `NO`, However to retrieve information on purchase price **(NOT UPCHARGE)**, user must have manager permissions and be logged in.

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "ingredients":[<Ingredient>]
}
```
Related objects:

- [Ingredient](#ingredient)

### /\<id>

> Gets information on an ingredient from IngredientId

METHODS: `GET`

Authentication Required: `NO`, However to retrieve information on purchase price **(NOT UPCHARGE)**, user must have manager permissions and be logged in.

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "ingredient":<Ingredient>
}
```
Related objects:

- [Ingredient](#ingredient)

### /kind

> Returns all Ingredient Kinds and their integer mapping

METHODS: `GET`

Authentication Required: `NO`

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "kinds":{<str>:<int>}
}
```

### /kind/\<kind>

> Returns all ingredients of kind \<kind>
>
> Accepts the integer or string representation of the kind

METHODS: `GET`

Authentication Required: `NO`, However to retrieve information on purchase price **(NOT UPCHARGE)**, user must have manager permissions and be logged in.

Parameters:
- `None`

Returns
if `<kind>` is of a valid type:
```json
STATUS: 200
{
    "error":<str>,
    "ingredients":[<Ingredient>]
}
```
if `<kind>` is of an invalid type:
```json
STATUS: 400
{
    "error":<str>,
    "ingredients":[]
}
```
Related objects:

- [Ingredient](#ingredient)

### /create

> Adds a new ingredient to the database

METHODS: `GET`

Authentication Required: `YES` must have manager level permissions

Parameters:
- `'Name'` -> str name of ingredient
- `'Kind'` -> str/int kind of ingredient
- `'Price'` -> float, cost for store to purchase more of ingredient
- `'Stock'` -> int, amount of ingredient in stock
- `'Upcharge'` -> float, cost for customer to add one unit of ingredient to drink.

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "ingredient":{}
}
```

if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "ingredient":{}
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "ingredient":<Ingredient>
}
```
Related objects:

- [Ingredient](#ingredient)

## /menuitems

### /

> Retrieves all menuitems

METHODS: `GET`

Authentication Required: `NO`

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "menuitems":[<MenuItem>]
}
```
Related objects:

- [MenuItem](#menuitem)

### /\<id>

> Gets information on an menu item from MenuId

METHODS: `GET`

Authentication Required: `NO`

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "menuitem":<MenuItem>
}
```
Related objects:

- [MenuItem](#menuitem)


### /recipe/\<recipe>

> Returns menu item of recipe
>
> This is the primary method for users to "create" drinks and how this model should be accessed in most cases

METHODS: `GET`

Authentication Required: `YES`, must have customer privileges

Parameters:
- `None`

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "menuitem":{}
}
```

If valid:
```json
STATUS:200
{
    "error":<str>,
    "menuitem":<MenuItem>
}
```

### /active

> Returns all 'Active' MenuItems

METHODS: `GET`

Authentication Required: `NO`

Parameters:
- `None`

Returns
```json
STATUS: 200
{
    "error":<str>,
    "menuitems":[<MenuItem>]
}
```
Related objects:

- [MenuItem](#menuitem)

### /activate/\<id>

> Sets menu item of \<id> to be Active

METHODS: `GET`

Authentication Required: `YES`, must have manager level permissions

Parameters:
- `None`

Returns:
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "menuitem":{}
}
```

if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "menuitem":{}
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "menuitem":<MenuItem>
}
```

Related objects:

- [MenuItem](#menuitem)

### /deactivate/\<id>

> Sets menu item of \<id> to be Inactive

METHODS: `GET`

Authentication Required: `YES`, must have manager level permissions

Parameters:
- `None`

Returns:
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "menuitem":{}
}
```

if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "menuitem":{}
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "menuitem":<MenuItem>
}
```

Related objects:

- [MenuItem](#menuitem)

### /update

> Updates existing menu item or creates if does not exist

METHODS: `POST`

Authentication Required: `YES` must have manager level permissions

Parameters:
- `'Name'` -> str name of menu item
- `'Recipe'` -> dict mapping ingredient ID to quantity
- `'Active'` -> bool, Whether drink should show up on homepage
- `'ImagePath'` -> str, path to image of drink

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "menuitem":{}
}
```

if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "menuitem":{}
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "menuitem":<MenuItem>
}
```
Related objects:

- [MenuItem](#menuitem)

## /orders

### /

> Retrieves all orders

METHODS: `GET`

Authentication Required: `YES` Must have employee level permissions or higher

Parameters:
- `None`

Returns

if token is invalid:

```json
STATUS:401
{
    "error":"Invalid Token",
    "orders":[]
}
```

  

if not authorized:

```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "orders":[]
}
```

If valid:
```json
STATUS: 200
{
    "error":<str>,
    "orders":[<Order>]
}
```
Related objects:

- [Order](#order)

### /\<id>

> Gets order from OrderId

METHODS: `GET`

Authentication Required: `YES`, UserId of requester must match UserId of order OR must have at least employee permissions

Parameters:
- `None`

Returns
if token is invalid:

```json
STATUS:401
{
    "error":"Invalid Token",
    "orders":None
}
```

if not authorized:

```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "orders":None
}
```

If valid:
```json
STATUS: 200
{
    "error":<str>,
    "order":<Order>
}
```
Related objects:

- [MenuItem](#menuitem)


### /order/status/\<status>

> Returns orders at status level \<status>

METHODS: `GET`

Authentication Required: `YES`, must have at least employee permissions

Parameters:
- `None`

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "orders":[]
}
```
if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "orders":[]
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "orders":[<Order>]
}
```

related objects:
- [Order](#order)

### /user/\<id>

> Orders belonging to user of UserId: \<id>

METHODS: `GET`

Authentication Required: `YES`, UserId of requester must match UserId of order OR must have at least employee permissions

Parameters:
- `None`

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "orders":[]
}
```
if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "orders":[]
}
```
if valid:
```json
STATUS: 200
{
    "error":<str>,
    "orders":[<Order>]
}
```
Related objects:

- [Order](#order)

### /user/\<id>/favorites

> Favorited Orders belonging to user of UserId: \<id>

METHODS: `GET`

Authentication Required: `YES`, UserId of requester must match UserId of order OR must have at least employee permissions

Parameters:
- `None`

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "orders":[]
}
```
if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "orders":[]
}
```
if valid:
```json
STATUS: 200
{
    "error":<str>,
    "orders":[<Order>]
}
```
Related objects:

- [Order](#order)

### /user/\<id>/cart

> Cart belonging to user of UserId: \<id>
>
>  If a user's cart already exists, will return the existing "cart" order. Otherwise creates a new Order
>
> This will be the only method of creating orders

METHODS: `GET`

Authentication Required: `YES`, UserId of requester must match UserId of order OR must have at least employee permissions

Parameters:
- `None`

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "order":None
}
```
if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "order":None
}
```
if valid:
```json
STATUS: 200
{
    "error":<str>,
    "orders":[<Order>]
}
```
Related objects:

- [Order](#order)

### /update

> Updates existing Order
> 
> You cannot update the totalprice, drinkprice (in items dictionary), and datetime manually.
> Once status is moved to PLACED, these values are automatically calculated and stored.
>
> State can only increase sequentially from one state to another. 
> CART -> PLACED -> FINISHED -> FULFILLED
> You cannot jump steps and you cannot go backwards a step.
> 
> Once a order is in the PLACED state, you cannot update the items dictionary.

METHODS: `POST`

Authentication Required: `YES`, UserId of requester must match UserId of order OR must have at least employee permissions

Parameters:
- `'OrderId'` -> int id of order to modify
- `'Items'` -> dict mapping MenuItem ID to dict of `{"quantity":<int>,"price":<float>}`
    - whatever gets passed in "price" is ignored, you can just pass Null values.
- `'Favorite'` -> bool, Whether order has been marked as "Favorite" by user
- `'Status'` -> str, status of order.

Returns
if token is invalid:
```json
STATUS:401
{
    "error":"Invalid Token",
    "order":{}
}
```

if not authorized:
```json
STATUS:403
{
    "error":"Insufficient Permissions",
    "order":{}
}
```
If valid:
```json
STATUS:200
{
    "error":<str>,
    "order":<MenuItem>
}
```
Related objects:

- [MenuItem](#menuitem)
- [Order](#order)

## Objects

### USER

> Represents a user.

```json
{
    "userId":<int>,
    "firstName":<str>,
    "lastName":<str>,
    "email":<str>,
    "permissions":<int>
}
```

### INGREDIENT

> Represents an ingredient for a drink.

```json
{
    "IngredientId":<int>,
    "Name":<str>,
    "Kind":<str>,
    "Price":<float>,
    "Stock":<int>,
    "Upcharge":<float>
}
```
### MENUITEM

> Represents a menu item (drink)
```json
{
    "MenuId":<int>,
    "Name":<str>,
    "Recipe":{<IngredientId>:<int>},
    "Price":<float>,
    "Active":<bool>,
    "ImagePath":<str>
}
```
`Recipe` is a dictionary of ingredient Ids as `<str>` mapped to quantities `<int>`

### ORDER

> Represents an order whether active or not (in cart)
```json
{
    "OrderId":<int>,
    "UserId":<int>,
    "Favorite":<bool>,
    "Items":{<MenuId>:{"quantity":<int>,"price":<float>}},
    "OrderDate":<datetime>,
    "Status":<str>,
    "TotalPrice":<float>
}