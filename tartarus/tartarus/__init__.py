import os

from flask import Flask
from flask_cors import CORS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'tartarus.sqlite'),
        CORS_HEADERS='Content-Type'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello, World!'

    # Register DB Functions
    from . import db
    db.init_app(app)

    # Register Auth Endpoints
    from . import auth
    app.register_blueprint(auth.bp)

    # Register User Endpoints
    from . import users
    app.register_blueprint(users.bp)

    # Register Ingredient Endpoints
    from . import ingredients
    app.register_blueprint(ingredients.bp)

    # Register MenuItem Endpoints
    from . import menuitems
    app.register_blueprint(menuitems.bp)

    # Register Order Endpoints
    from . import orders
    app.register_blueprint(orders.bp)

    # Register Employee Endpoints
    from . import employee
    app.register_blueprint(employee.bp)

    return app