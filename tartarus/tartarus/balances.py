import traceback
from tartarus.models.TartarusException import TartarusException
from .models.Balance import Balance
from .auth import check_token
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)

bp = Blueprint('balance',__name__, url_prefix='/balance')

@bp.route('/<id>',methods=(['GET']))
def get_id(id):
    """Returns balance of ID"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    balancePayload = {}
    if not requester:
        status = 401
        error = "Invalid Token"
    balance = Balance.fromID(id)
    if balance == None:
        status = 404
        error = "No such balance"
    elif requester.getPermissions() < 1 and balance.getUserID() != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if not error:
        balancePayload = balance.getJSON()
    return (
        {
            'error':error,
            'balance':balancePayload
        },
        status
    )

@bp.route('/user/<id>',method=(['GET']))
def get_user(id):
    """Returns balance of user"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,elevated = check_token(token,1)
    error = None
    status = 200
    balancePayload = {}

    if not requester:
        status = 401
        error = "Invalid Token"
    balance = Balance.fromUserID(id)
    if balance == None:
        status = 404
        error = "No such user"
    elif requester.getPermissions < 1 and balance.getUserID() != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    if not error:
        balancePayload = balance.getJSON()
    return (
        {
            'error':error,
            'balance':balancePayload
        },
        status
    )

@bp.route('/store', method=(['GET']))
def get_store():
    """Gets the balance of the store"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,elevated = check_token(token,2)
    error = None
    status = 200
    balancePayload = {}

    if not requester:
        status = 401
        error = "Invalid Token"
    elif not elevated:
        status = 403
        error = "Insufficient Privileges"
    if not error:
            balance = Balance.getStoreBalance()
            balancePayload = balance.getJSON()
    return (
        {
            'error':error,
            'balance':balancePayload
        },
        status
    )

@bp.route('/<id>/increment/<amt>', method=(['GET']))
def increment(id, amt):
    """Increments the balance at `id` by `amt`"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    error = None
    status = 200
    balancePayload = {}
    if not requester:
        status = 401
        error = "Invalid Token"
    balance = Balance.fromID(id)
    if balance == None:
        status = 404
        error = "No such balance"
    elif requester.getPermissions() < 1 and balance.getUserID() != requester.getId():
        status = 403
        error = "Insufficient Privileges"
    try:
        balance.increment_balance(float(amt))
    except TartarusException as e:
        status = 400
        error = str(e)
    except Exception as e:
        status = 400
        error = "Invalid Operation"
        print(e)
        print(traceback.print_tb(e.__traceback__))
    if not error:
        balancePayload = balance.getJSON()
    return (
        {
            'error':error,
            'balance':balancePayload
        },
        status
    )

