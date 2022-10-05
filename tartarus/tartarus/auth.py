import functools
import jwt
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from tartarus.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

class User:
    __id = 0
    __name = ""
    __email = ""
    __password = ""
    __permissions = 0
    def __init__(self, name, email, password, permissions = 0):
        self.__name = name
        self.__email = email
        self.__password = password
        self.__permissions = permissions
    
    def getId(self):
        return self.__id
    def getName(self):
        return self.__name
    def getEmail(self):
        return self.__email
    def getPermissions(self):
        return self.__permissions
    def getPassword(self):
        return self.__password
    def setId(self, id):
        self.__id = id

@bp.route('/newuser', methods=['GET', 'POST'])
def add_user():
    if request.method == 'POST':
        result = request.get_json()
        newUser = User(
            result['name'],
            result['email'],
            generate_password_hash(result['password']),
            0
        )
        if(checkExistingUser(newUser)):
            return {'error': 'User already exists'}
        else:
            addedUser = addUser(newUser)
            return json.dumps({
                'userId': addedUser.getId(),
                'userEmail' : addedUser.getEmail(),
                'userName': addedUser.getName(),
                'userPassword': addedUser.getPassword() 
                })
    else:
        return {'response': 'This is in place of the user sign-up form'}

    
def checkExistingUser(user):
    db = get_db()
    cur = db.cursor()
    email = cur.execute(f"select email from users where email = '{user.getEmail()}'").fetchone()
    if (email is None):
        return False
    else:
        return True

def addUser(user):
    db = get_db()
    cur = db.cursor()
    cur.execute(f"insert into users(email, name, password) values ('{user.getEmail()}', '{user.getName()}', '{user.getPassword()}')")
    db.commit()
    return getUserFromEmail(user.getEmail())

def getUserFromEmail(email):
    db = get_db()
    cur = db.cursor()
    output = cur.execute(f"select * from users where email = '{email}'" )
    data = output.fetchone()
    # Insert get permissions
    user = User(data[2], data[1], data[3], 0)
    user.setId(data[0])
    return user

# TOKEN METHODS
@app.route('/token', methods=(['POST']))
def get_token():
    """Generates jwt according user if credentials are correct"""
    if request.method == 'POST':
        formdata = request.get_json()
        email = formdata['email']
        password = formdata['password']
        print('')
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM users where email = ?', (email,)
        ).fetchone()

        if user is None:
            error = 'Incorrect email.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password'
        
        if error is None:
            payload = {
                'sub':user['UserId'],
                'name':user['email'],
            }
            token = jwt.encode(payload = payload, key='Dan-TheMan-Watson')
            return {'token':token}
        else:
            return {'error':error}

# Need a token check method here
def check_token(token,credential_level=0):
    """Verifies token is valid. Will return false if expired, null, or if permission level doesn't match/exceed credential_level"""
    pass