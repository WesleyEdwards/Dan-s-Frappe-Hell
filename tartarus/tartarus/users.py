from .models.User import User, checkExistingUser, addUser, getUserById, getUserList, createUserJSON, updatePermissions, updateEmail, updateName, updatePassword
from .auth import check_token
from flask import(
    Blueprint, request
)
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/new', methods=(['POST']))
def create_user():
    result = request.get_json()
    error = None
    status = 200

    firstName = result['firstName']
    lastName = result['lastName']
    email = result['email']
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
                1
            ))
        except Exception as e:
            print(e)
            error = "Error adding user"
            status = 500
    return ({
        'error': error,
        },
        status
        )

#TODO: figure out how to append data to a dictionary
@bp.route('/all', methods=(['GET']))
def getAllUsers():
    users = {}
    error = None
    status = 200
    token = request.headers['Authorization']
    if (check_token(token, 3)[1]):
        i = 1
        for element in getUserList():
           user = User(element[2], element[3], element[1], element[4], element[5])
           user.setId(element[0])
           users[f'user{i}'] = createUserJSON(user)
           i += 1
    else:
        error = "Invalid token or permissions"
        status = 403
    return (
        {
            'users': users,
            'error': error,
        },
        status
    )

@bp.route('/permissions', methods=(['POST']))
def changePermissions():
    status = 200
    error = None
    newUser = None
    token = request.headers['Authorization']
    auth = check_token(token, 3)
    user = auth[0]
    form = request.get_json()
    newPerm = form['permLevel']
    if(auth[1]):
        try:
            updatePermissions(user.getId(), newPerm)
            newUser = getUserById(user.getId())
        except Exception as ex:
            error = "Error updating user permissions " + ex
            status = 500
    else:
        status = 401
        error = "Invalid or expired token"
    
    return (
        {
            'error': error,
            'user': createUserJSON(newUser)
        },
        status
    )

@bp.route('/modify', methods=(['POST']))
def modifyUser():
    status = 200
    error = None
    updatedUser = None
    auth = check_token(request.headers['Authorization'])
    if (auth[0] is None):
        error = "Invalid token"
        status = 401
    else:
        user = auth[0]
        result = request.get_json()
        firstName = result['firstName']
        lastName = result['lastName']
        email = result['email']
        password = result['password']

        if(user.getEmail() != email):
            try:
                updateEmail(user.getId(), email)
            except Exception as ex:
                status = 500
                error = "Error updating email: " + str(ex)
        if(user.getFirstName() != firstName or user.getLastName != lastName):
            try:
                updateName(user.getId(), firstName, lastName)
            except Exception as ex:
                status = 500
                error = "Error updating name: " + str(ex)
        if(not check_password_hash(user.getPassword(), password)):
            try:
                updatePassword(user.getId(), generate_password_hash(password))
            except Exception as ex:
                status = 500
                error = "Error updating password: " + str(ex)

        if(status is 200):
            updatedUser = createUserJSON(getUserById(user.getId()))

    return (
        {
            "error": error,
            "user": updatedUser
        },
        status
    )
        
