import functools
import time
import jwt
import json
from .models.User import User
from .models.Ingredient import Ingredient
from .auth import check_token
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app
)

from tartarus.db import get_db

bp = Blueprint('ingredients', __name__, url_prefix='/ingredients')

# TOKEN METHODS
@bp.route('/', methods=(['GET']))
def get_all():
    """Returns all ingredients"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    permissions = int(requester.getPermissions()) if requester else 0
    error = None
    status = 200
    ingredientsPayload = []
    ingredients = Ingredient.ofAll()
    for x in ingredients:
        if permissions > 0:
            price = x.getPrice()
        else:
            price = None
        ingredient = {
            'IngredientId':x.getId(), 
            'Name':x.getName(), 
            'Kind':x.getKind().name,
            'Price':price,
            'Stock':x.getStock(),
            'Upcharge':x.getUpcharge()
            }        
        ingredientsPayload.append(ingredient)
    return (
        {
        'error':error,
        'ingredients':ingredientsPayload
        },
        status
    )

@bp.route('/<id>',methods=(['GET']))
def get_id(id):
    """Returns ingredient of ID"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    permissions = int(requester.getPermissions()) if requester else 0
    error = None
    status = 200
    ingredientPayload = {}
    ingredient = Ingredient.fromID(id)
    if permissions > 0:
        price = ingredient.getPrice()
    else:
        price = None
    ingredientPayload = {
        'IngredientId':ingredient.getId(), 
        'Name':ingredient.getName(), 
        'Kind':ingredient.getKind().name,
        'Price':price,
        'Stock':ingredient.getStock(),
        'Upcharge':ingredient.getUpcharge()
        }        
    return (
        {
        'error':error,
        'ingredient':ingredientPayload
        },
        status
    )

@bp.route('/update', methods=['POST'])
def update_ingredient():
    token = request.headers['Authorization'].split(' ')[-1]
    user,authorized = check_token(token,2)
    status = 200
    error = None
    ingredientPayload = {}
    if not user:
        status = 401
        error = "Invalid Token"
    if not authorized:
        status = 403
        error = "Insufficient Permissions"
    if status == 200:
        data = request.get_json()
        ingredient = Ingredient.fromID(data['IngredientId'])
        ingredient.setName(data['Name'])
        ingredient.setKind(data['Kind'])
        ingredient.setPrice(data['Price'])
        ingredient.setStock(data['Stock'])
        ingredient.setUpcharge(data['Upcharge'])
        ingredientPayload = ingredient.getJson()
    return (
        {
        'error':error,
        'ingredient':ingredientPayload
        },
        status
    )

@bp.route('/kind')
def get_all_types():
    """Returns all ingredient kinds"""
    kinds = {}
    error = None
    status = 200
    for kind in (Ingredient.Kind):
        kinds[kind.name] = kind.value
    return (
        {
            'error':error,
            'kinds':kinds
        },
        status
    )
    
@bp.route('/kind/<kind>')
def get_type(kind):
    """Returns all ingredients of type"""
    token = request.headers['Authorization'].split(' ')[-1]
    requester,_ = check_token(token)
    permissions = int(requester.getPermissions()) if requester else 0
    error = None
    status = 200
    ingredientsPayload = []
    try:
        ingredients = Ingredient.ofKind(kind)
    except TypeError:
        error = "Unrecognized kind"
        status = 400
        ingredients = []
    for x in ingredients:
        if permissions > 0:
            price = x.getPrice()
        else:
            price = None
        ingredient = {
            'IngredientId':x.getId(), 
            'Name':x.getName(), 
            'Kind':x.getKind().name,
            'Price':price,
            'Stock':x.getStock(),
            'Upcharge':x.getUpcharge()
            }        
        ingredientsPayload.append(ingredient)
    return (
        {
        'error':error,
        'ingredients':ingredientsPayload
        },
        status
    )

@bp.route('/create', methods=['POST'])
def create_ingredient():
    token = request.headers['Authorization'].split(' ')[-1]
    user,authorized = check_token(token,3)
    status = 200
    error = None
    ingredientPayload = {}
    if not user:
        status = 401
        error = "Invalid Token"
    if not authorized:
        status = 403
        error = "Insufficient Permissions"
    if status == 200:
        data = request.get_json()
        ingredient = Ingredient(data['Name'],data['Kind'],data['Price'],data['Stock'],data['Upcharge'])
        ingredient.addToDatabase()
        ingredientPayload = {
            'IngredientId':ingredient.getId(), 
            'Name':ingredient.getName(), 
            'Kind':ingredient.getKind().name,
            'Price':ingredient.getPrice(),
            'Stock':ingredient.getStock(),
            'Upcharge':ingredient.getUpcharge()
            } 
    return (
        {
        'error':error,
        'ingredient':ingredientPayload
        },
        status
    )