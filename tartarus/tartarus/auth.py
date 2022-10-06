import functools
import time
import jwt
import json
from .models.User import User
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)
from werkzeug.security import check_password_hash, generate_password_hash

from tartarus.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

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
@bp.route('/token', methods=(['POST']))
def get_token():
    """Generates jwt according user if credentials are correct"""
    if request.method == 'POST':
        formdata = request.get_json()
        email = formdata['email']
        password = formdata['password']
        print('')
        db = get_db()
        token = None
        error = None
        user = db.execute(
            'SELECT * FROM users where email = ?', (email,)
        ).fetchone()

        if user is None:
            error = 'Incorrect email.'
            userJson = None
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password'
            userJson = None
        else:
            userJson = {
                'userId':user['UserId'],
                'firstName':user['FirstName'],
                'lastName':user['LastName'],
                'email':user['email'],
                'permissions':user['PermissionLevel']
            }
        
        if error is None:
            header = {
                'alg':'HS256',
                'typ':'JWT'
            }
            now = int(time.time())
            payload = {
                'sub':user['UserId'],
                'firstName':user['firstName'],
                'lastName':user['lastName'],
                'email':user['email'],
                'permissions':user['permissions'],
                'iat':now,
                'exp':now + 30 * 60, # Expires 30 minutes from issue
            }
            token = jwt.encode(headers=header, payload=payload, key=current_app.secret_key)
        return {
            'token':token,
            'error':error,
            'user':userJson
            }

# Need a token check method here
def check_token(token,permission_level=0) -> 'tuple[User,bool]':
    """
    Verifies token is valid. 
    Returns a tuple of a User and a boolean representing authorization
    If User is null, that means the token doesn't exist or is otherwise invalid.
    If the boolean is false and the user is not null, that means the token is valid, but the user's permissions are not high enough.
    """
    try:
        decoded = jwt.decode(token, current_app.secret_key)
    except:
        return None,False
    # verify not timed out
    if decoded['exp'] >= int(time.time()):
        return None,False
    user = User(decoded['firstName'], decoded['lastName'], decoded['email'], decoded['password'], int(decoded['permissions']))
    
    return user, user.getPermissions() >= permission_level
    
