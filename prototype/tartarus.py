from flask import Flask

app = Flask(__name__)


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

##########################################