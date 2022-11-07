import functools
import time
import jwt
import json
from .models.User import User, getUserByEmail, createUserJSON, getUserById
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)
from werkzeug.security import check_password_hash, generate_password_hash

from tartarus.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

# TOKEN METHODS
@bp.route('/token', methods=(['POST']))
def get_token():
    """Generates jwt according user if credentials are correct"""
    if request.method == 'POST':
        formdata = request.get_json()
        email = formdata['email']
        password = formdata['password']
        print('')
        token = None
        error = None
        status = 200
        user = getUserByEmail(email)
        if user is None:
            error = 'Invalid Credentials'
            userJson = None
            status = 401
        elif not check_password_hash(user.getPassword(), password):
            error = 'Invalid Credentials'
            userJson = None
            status = 401
        else:
            userJson = createUserJSON(user)
        
        if error is None:
            header = {
                'alg':'HS256',
                'typ':'JWT'
            }
            now = int(time.time())

            id = user.getId()
            fname = user.getFirstName()
            lname = user.getLastName()
            uemail = user.getEmail()
            perm = user.getPermissions()

            payload = {
                'sub':id,
                'firstName':fname,
                'lastName':lname,
                'email':uemail,
                'permissions':perm,
                'iat':now,
                'exp':now + 30 * 60, # Expires 30 minutes from issue
            }
            token = jwt.encode(headers=header, payload=payload, key=current_app.secret_key)
        return (
            {
            'token':token,
            'error':error,
            'user': userJson
            },
            status
            )

# Need a token check method here
def check_token(token,permission_level=0) -> 'tuple[User,bool]':
    """
    Verifies token is valid. 
    Returns a tuple of a User and a boolean representing authorization
    If User is null, that means the token doesn't exist or is otherwise invalid.
    If the boolean is false and the user is not null, that means the token is valid, but the user's permissions are not high enough.
    """
    # Return 401 error if token is invalid
    # Return 403 error if token is valid, but no permissions
    try:
        decoded = jwt.decode(token, current_app.secret_key, 'HS256')
    except Exception as e:
        print(e)
        return None,False
    # verify not timed out
    if decoded['exp'] <= int(time.time()):
        print(decoded['exp'])
        print(int(time.time()))
        return None,False
    user = getUserById(int(decoded['sub']))
    
    return user, (user.getPermissions() >= permission_level)
    
