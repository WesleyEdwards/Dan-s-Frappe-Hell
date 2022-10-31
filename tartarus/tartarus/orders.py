import functools
from multiprocessing.util import is_abstract_socket_namespace
import time
import traceback
import jwt
import json
from .models.User import User
from .models.Order import Order
from .models.TartarusException import TartarusException
from .auth import check_token
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)

from tartarus.db import get_db

bp = Blueprint('orders', __name__, url_prefix='/orders')

# TOKEN METHODS
@bp.route('/', methods=(['GET']))
def get_all():
    """Returns all orders"""
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,authorized = check_token(token,1)
    error = None
    status = 200
    ordersPayload = []
    if not requester:
        status = 401
        error = "Invalid Token"
    elif not authorized:
        status = 403
        error = "Insufficient Permissions"
    if status == 200:
        orders = Order.ofAll()
        for x in orders:
            order = x.getJson()       
            ordersPayload.append(order)
    return (
        {
        'error':error,
        'orders':ordersPayload
        },
        status
        )

@bp.route('/<id>',methods=(['GET']))
def get_id(id):
    """Returns order of ID"""
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    orderPayload={}
    if not requester:
        status = 401
        error = "Invalid Token"
    order = Order.fromID(id)
    if order == None:
        status = 404
        error = "Order not found"
    if requester.getPermissions() < 1 and order.getUserId() != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if not error:
        orderPayload = order.getJson()        
    return (
        {
        'error':error,
        'order':orderPayload
        },
        status
    )

@bp.route('/status/<state>')
def get_all_in_state(state):
    """Returns all orders in State <state>"""
    error = None
    status = 200
    ordersPayload = []
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,authorized = check_token(token,1)
    if not requester:
        status = 401
        error = "Invalid Token"
    if not authorized:
        status = 403
        error = "Insufficient Permissions"
    if status == 200:
        orders = []
        try:
            orders = Order.ofStatus(state)
        except:
            status = 400
            error = "Invalid state"
        for x in orders:
            order = x.getJson()       
            ordersPayload.append(order)
    return (
        {
        'error':error,
        'orders':ordersPayload
        },
        status
    )

@bp.route('/user/<id>')
def get_all_of_user(id):
    """Gets all of a user's orders"""
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    orderPayload=[]
    if not requester:
        status = 401
        error = "Invalid Token"
    orders = Order.ofUser(id)
    if requester.getPermissions() < 1 and id != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if not error:
        for order in orders:
            orderPayload.append(order.getJson())
    return (
        {
        'error':error,
        'orders':orderPayload
        },
        status
    )

@bp.route('/user/<id>/favorites')
def get_favorites_of_user(id):
    """Gets all of a user's favorited orders"""
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    orderPayload=[]
    if not requester:
        status = 401
        error = "Invalid Token"
    orders = Order.ofUserFavorite(id)
    if requester.getPermissions() < 1 and id != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if not error:
        for order in orders:
            orderPayload.append(order.getJson())
    return (
        {
        'error':error,
        'orders':orderPayload
        },
        status
    )

@bp.route('/user/<id>/cart')
def get_cart_of_user(id):
    """Gets the user's cart"""
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    orderPayload=None
    if not requester:
        status = 401
        error = "Invalid Token"
    elif  requester.getPermissions() < 1 and id != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    else:
        try:
            order = Order.ofUserCart(id)
        except TartarusException as e:
            error = str(e)
            status = 404
    if not error:
        orderPayload = order.getJson()
    return (
        {
        'error':error,
        'order':orderPayload
        },
        status
    )

@bp.route('/update', methods=['POST'])
def update_order():
    token = request.headers.get('Authorization',"").split(' ')[-1]
    requester,_ = check_token(token)
    status = 200
    error = None
    orderPayload = {}
    data = request.get_json()
    order = Order.fromID(data.get("OrderId"))
    if not requester:
        status = 401
        error = "Invalid Token"
    elif order == None:
        status = 404
        error = "Order not Found"
    elif requester.getPermissions() < 1 and order.getUserId() != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if status == 200:
        try:
            order.setFavorite(bool(data["Favorite"]))
            order.setItems(data["Items"])
            order.setStatus(data["Status"])
        except TartarusException as t:
            status = 400
            error = str(t)
        except Exception as e:
            status = 400
            error = "Invalid Parameters"
            print(e)
            print(traceback.print_tb(e.__traceback__))
        if not error:
            orderPayload = order.getJson()
    return (
        {
        'error':error,
        'order':orderPayload
        },
        status
    )