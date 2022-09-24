import os
import sqlite3
import jwt
from this import d
from urllib import request
from flask import Flask
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'tartarus.sqlite')
)
if not os.path.exists(app.instance_path):
    os.mkdir(app.instance_path)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/demo')
def demo():
    with open("prototype_signin.html") as f:
        return f.read()

# Geoffrey work here #####################

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
        db.executescript(f.read().decode('utf8'))
    return 'Done'

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