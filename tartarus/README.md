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