from email import header
from getpass import getuser
import json
from pydoc import resolve
from tartarus.tartarus.models.User import createUserJSON
import tartarus.users
from tartarus.models.User import (
    User, getUserByEmail
)
from werkzeug.security import generate_password_hash, check_password_hash

def test_create_user(client, app):
    response = client.post(
        '/users/new',
        json={
            'firstName': 'test', 
            'lastName': 'McTesterson',
            'email': 'test@testemail.com',
            'password' : 'testingpassword'
            }
    )

    assert response.status_code == 200
    assert response.json['error'] == None

    user = getUserByEmail('test@testemail.com')

    assert user != None
    assert user.getFirstName() == "test"
    assert user.getLastName() == "McTesterson"
    assert check_password_hash(user.getPassword(), 'testingpassword')

def test_changePermissions(client):
    login = client.post(
        '/auth/token', 
        json={
            'email': 'manager@dfh.com',
            'password': 'password'
        }
    )
    
    token = login.json['token']

    response = client.post(
        '/users/permissions',
        header = {
            'Authorization': token
        },
        json={
            'permLevel': 1,
            'userId': 3
        }
    )

    assert response.status_code == 200
    assert response.json['user'] == createUserJSON(getUserByEmail('test@testemail.com'))

def test_modify_User(client):
    login = client.post(
        '/auth/token', 
        json={
            'email': 'test@testemail.com',
            'password': 'testingpassword'
        }
    )
    
    token = login.json['token']

    response = client.post(
        '/users/modify',
        header={
            'Authorization': token
        },
        json={
            'firstName': 'test',
            'lastName': 'McTesterson',
            'email': 'test@testemail.com',
            'password': 'testingpassword1'
        }
    )

    userPassword = getUserByEmail('test@testemail.com').getPassword()
    assert response.status_code == 200
    assert check_password_hash(userPassword, 'testingpassword1')

    
