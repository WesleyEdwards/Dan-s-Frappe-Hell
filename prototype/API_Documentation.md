# Tartarus API Documentation

## Admin/General

### /
- Description: Basic landing page
- Supported Methods: GET, POST
- Authentication Required: No
- Input: None
- Return: Welcome message

### /demo
- Description: Launches demo login site
- Supported Methods: GET
- Authentication Required: No
- Input: None
- Return: prototype_signin.html (login page)

### /refreshdb
- Description: Completely resets the database
- Supported Methods: GET
- Authentication Required: No
- Input: None
- Return: Success message

## User

### /newuser
- Description: Allows the addition of new users to the system
- Supported Methods: GET, POST
- Authentication Required: No
- Input - POST: 
```
{
    'firstName': 'John',
    'lastName': 'Smith',
    'email': 'emailtest@email.com',
    'password': 'Password1'
}
```
- Return - POST: error message or user object
```
{
    'userId': '234',
    'userEmail': 'emailtest@email.com',
    'userName': 'John Smith',
    'userPassword': 'Password1'
}
```
- Return - GET: user sign-up form

## Authentication

### /auth/token
- Description: Issues token to user upon successful login
- Supported Methods: POST
- Authentication Required: No
- Input:
```
    {
        'email': 'testuser@email.com',
        'password': 'Password1'
    }
```
- Return: jwt token
