from .models.User import User, checkExistingUser, addUser
from .auth import check_token
from flask import(
    Blueprint, request
)
from werkzeug.security import generate_password_hash

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/new', methods=(['POST']))
def create_user():
    result = request.get_json()
    error = None
    status = 200

    firstName = result['firstName']
    lastName = result['lastName']
    email = result['address']
    password = generate_password_hash(result['password'])

    if(checkExistingUser(email)):
        error = "User already exists"
        status = 400
    else:
        try:
            addUser(User(
                firstName,
                lastName,
                email,
                password,
                3
            ))
        except Exception as e:
            print(e)
            error = "Error adding user"
            status = 500
    return {
        'error': error,
        'status': status
        }

@bp.route('/all', methods=(['POST']))
def getAllUsers():
    users = {}
    error = None
    status = 200
    token = request.headers['Authorization']
    i = 1
    if (check_token(token, 3)[1]):
        for element in User.getUserList(cur):
           user = User(element[2], element[3], element[1], element[4], element[5])
           users += {f'user{i}': User.createUserJSON(user)}
           i += 1
    else:
        error = "Invalid token or permissions"
        status = 403
    return (
        {
            'users': users,
            'error': error,
            'status': status
        }
    )
    