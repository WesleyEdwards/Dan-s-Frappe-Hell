# from crypt import methods
import json
import os
import sqlite3
import jwt
from this import d
from flask import request
from flask import Flask
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__, instance_relative_config=True)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'tartarus.sqlite'),
    CORS_HEADERS='Content-Type'
)
if not os.path.exists(app.instance_path):
    os.mkdir(app.instance_path)

@app.route('/', methods=['GET', 'POST'])
def hello():
    return {'response': 'Hello, World! You have successfully reached the Tartarus API.'}

@app.route('/demo')
def demo():
    with open("prototype_signin.html") as f:
        return f.read()

# Geoffrey work here #####################
class User:
    id = 0
    name = ""
    email = ""
    password = ""
    permissions = 0
    def __init__(self, name, email, password, permissions = 0):
        self.name = name
        self.email = email
        self.password = password
        self.permissions = permissions
    
    def getId(self):
        return self.id
    def getName(self):
        return self.name
    def getEmail(self):
        return self.email
    def getPermissions(self):
        return self.permissions
    def getPassword(self):
        return self.password
    def setId(self, id):
        self.id = id

@app.route('/newuser', methods=['GET', 'POST'])
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

##########################################

# Josh work here #########################
def get_db():
    # if not os.path.exists(app.config['DATABASE']):
    #     f = open(app.config['DATABASE'],'x')
    #     f.close()
    print(app.config['DATABASE'])
    db = sqlite3.connect(
        app.config['DATABASE'],
        detect_types=sqlite3.PARSE_DECLTYPES
    )
    db.row_factory = sqlite3.Row
    return db
@app.route('/refreshdb')
def refreshdb():
    db = get_db()
    with app.open_resource('schema.sql') as f:
        script = str(f.read(), 'utf-8')
        db.executescript(script)
    return {'response': 'Done'}

@app.route('/auth/token', methods=(['POST']))
def get_token():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user where email = ?', (email,)
        ).fetchone()

        if user is None:
            error = 'Incorrect email.'
        elif not check_password_hash(user['password'], password):
            error = 'Incorrect password'
        
        if error is not None:
            payload = {
                'sub':user['id'],
                'name':user['username'],
                'permission':user['permission']
            }
            token = jwt.encode(payload = payload, key='Dan-TheMan-Watson')
            return token
        else:
            return error

##########################################