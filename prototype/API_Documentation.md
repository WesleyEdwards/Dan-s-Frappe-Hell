# Tartarus API Documentation

## Admin/General

### /
- Basic landing page
- Supported Methods: GET, POST
- Input: None
- Authentication Required: No
- Return: Welcome message

### /demo
- Launches demo login site
- Supported Methods: GET
- Input: None
- Authentication Required: No
- Return: prototype_signin.html (login page)

### /refreshdb
- Completely resets the database
- Supported Methods: GET
- Input: None
- Authentication Required: No
- Return: Success message

## User

## Authentication

### /auth/token
- Issues token to user upon successful login
- Supported Methods: POST
- Input: ```
    {
        'email': 'testuser@email.com',
        'password': 'Password1'
    }
```
- Authentication Required: No
- Return: jwt token
