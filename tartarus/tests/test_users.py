import json
from tartarus.models.User import createUserJSON
import tartarus.users
from tartarus.models.User import (
    User, getUserByEmail
)
from werkzeug.security import generate_password_hash, check_password_hash
import pytest
    
@pytest.mark.skip("Test broken")
def test_create_user(client):
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

@pytest.mark.skip("Test broken")
def test_changePermissions(client, auth):
    token = auth.login()

    response = client.post(
        '/users/permissions',
        headers = {
            'Authorization': token
        },
        json={
            'newPerm': 1,
            'userId': 1
        }
    )

    assert response.status_code == 200

def test_modify_User(client, auth):
    token = auth.login()

    response = client.post(
        '/users/modify',
        headers={
            'Authorization': token
        },
        json={
            'firstName': 'test',
            'lastName': 'McTesterson',
            'email': 'test@testemail.com',
            'password': 'testingpassword1'
        }
    )
    
    assert response.status_code == 200


    
