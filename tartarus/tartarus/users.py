from .models.User import User, checkExistingUser, addUser, getUserByEmail, getUserById, getUserList, createUserJSON, updatePermissions, updateEmail, updateName, updatePassword
from .auth import check_token, generateToken
from .employee import newEmployee
from .models.Employee import getEmployee
from flask import(
    Blueprint, request
)
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.route('/new', methods=(['POST']))
def create_user():
    result = request.get_json()
    email = result['email']

    if(checkExistingUser(email)):
        return ({'error': 'User already exists'}, 400)

    if(len(result['password']) < 8):
        return ({'error': 'Password must be a minimum of 8 characters'}, 400)

    try:
        addUser(User(
            result['firstName'],
            result['lastName'],
            email,
            generate_password_hash(result['password']),
            1
        ))
    except Exception as e:
        print(e)
        return ({'error': 'Error creating user'}, 500)

    user = getUserByEmail(email)
    
    return (
        {
            'user': createUserJSON(user),
            'token': generateToken(user)
        }, 
        200)

@bp.route('/all', methods=(['GET']))
def getAllUsers():
    users = []
    token = request.headers.get('Authorization').split(" ")[-1]
    print(token)
    requester, authorized = check_token(token, 2)

    if requester == None:
        return ({'error': 'Invalid token'}, 401)

    if not authorized:
        return ({'error': 'Insufficient permissions'}, 403)

    for element in getUserList():
        user = User(element[2], element[3], element[1], element[4], element[5])
        user.setId(element[0])
        users.append(createUserJSON(user))

    return ({'users': users}, 200)

@bp.route('/permissions', methods=(['POST']))
def changePermissions():
    status = 200
    error = None
    newUser = None
    token = request.headers['Authorization']
    auth = check_token(token, 3)

    form = request.get_json()
    user = getUserById(form['userId'])
    if user == None:
        print("No User Found")
    newPerm = form['newPerm']
    payRate = form['payRate']
    if auth[0] is None:
        error = "No User Found"
        status = 403
    elif(auth[1]):
        try:
            if getEmployee(user.getId()) == None:
                newEmployee(user.getId(), payRate)
            updatePermissions(user.getId(), newPerm)
            newUser = getUserById(user.getId())
        except Exception as ex:
            error = "Error updating user permissions " + str(ex)
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
                if(not updateEmail(user.getId(), email)):
                    status = 500
                    error = "Error updating email: Email already exists"
            except Exception as ex:
                status = 500
                error = "Error updating email" + str(ex)

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
            response = {
            "error": error,
            "userId": updatedUser['userId'],
            "modifiedUser": updatedUser
        }
        else:
            response = {"error": error}
    return (
        response,
        status
    )

@bp.route('/fromEmail', methods=(['POST']))
def getUserFromEmail():
    status = 200
    error = None
    user = None
    auth = check_token(request.headers['Authorization'], 1)
    if auth[0] is None:
        error = "Invalid Token"
        status = 401
    elif not auth[1]:
        error = "Invalid Permissions"
        status = 401
    else:
        email = request.get_json()['email']
        user = createUserJSON(getUserByEmail(email))
    return(
        {
            'error': error,
            'user': user
        },
        status
    )
