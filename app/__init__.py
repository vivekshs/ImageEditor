from flask import Flask

def create_app():
    app = Flask(__name__, static_url_path="/ImageEditor/app/static")

    from app.routes import main
    app.register_blueprint(main)

    return app
