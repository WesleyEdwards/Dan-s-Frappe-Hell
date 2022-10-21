import functools
from multiprocessing.util import is_abstract_socket_namespace
import time
import jwt
import json
from .models.User import User
from .models.MenuItem import MenuItem
from .auth import check_token
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)

from tartarus.db import get_db

bp = Blueprint('menuitems', __name__, url_prefix='/menuitems')

# TOKEN METHODS
@bp.route('/', methods=(['GET']))
def get_all():
    """Returns all items"""
    error = None
    status = 200
    itemsPayload = []
    items = MenuItem.ofAll()
    for x in items:
        item = x.getJson()       
        itemsPayload.append(item)
    return (
        {
        'error':error,
        'menuitems':itemsPayload
        },
        status
    )

@bp.route('/<id>',methods=(['GET']))
def get_id(id):
    """Returns menu item of ID"""
    error = None
    status = 200
    itemPayload = {}
    item = MenuItem.fromID(id)
    itemPayload = item.getJson()        
    return (
        {
        'error':error,
        'menuitem':itemPayload
        },
        status
    )

@bp.route('/active')
def get_all_active():
    """Returns all active menu items"""
    error = None
    status = 200
    itemsPayload = []
    items = MenuItem.ofActive()
    for x in items:
        item = x.getJson()       
        itemsPayload.append(item)
    return (
        {
        'error':error,
        'menuitems':itemsPayload
        },
        status
    )

@bp.route('/activate/<id>')
def activate_item(id):
    """Sets a menu item to active"""
    return toggle_active(request, id, True)
    

@bp.route('/deactivate/<id>')
def deactivate_item(id):
    """Sets a menu item to inactive"""
    return toggle_active(request, id, False)

def toggle_active(request, id, active):
    token = request.headers['Authorization'].split(' ')[-1]
    requester,authorized = check_token(token,2)
    error = None
    itemPayload={}
    status = 200
    if not requester:
        error = "Invalid Token"
        status = 401
    elif not authorized:
        error = "Insufficient Permissions"
        status = 403
    
    if not error:
        item = MenuItem.fromID(id)
        item.setActive(active)
        itemPayload = item.getJson()
    return {'error':error, 'menuitem':itemPayload},status

@bp.route('/recipe/<recipe>')
def get_recipe(recipe):
    """Returns menu item of recipe"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    if requester == None:
        error = "Invalid Token"
        status = 401
    error = None
    status = 200
    itemPayload = {}
    if error == None:
        item = MenuItem.fromRecipe(recipe)
        itemPayload = item.getJson()        
    return (
        {
        'error':error,
        'menuitem':itemPayload
        },
        status
    )

@bp.route('/update', methods=['POST'])
def update_menuitem():
    token = request.headers['Authorization'].split(' ')[-1]
    user,authorized = check_token(token,3)
    status = 200
    error = None
    itemPayload = {}
    if not user:
        status = 401
        error = "Invalid Token"
    if not authorized:
        status = 403
        error = "Insufficient Permissions"
    if status == 200:
        data = request.get_json()
        item = MenuItem.fromRecipe(data['Recipe'])
        item.setActive(data['Active'])
        item.setImagePath(data['ImagePath'])
        item.setName(data['Name'])
        itemPayload = item.getJson()
    return (
        {
        'error':error,
        'menuitem':itemPayload
        },
        status
    )