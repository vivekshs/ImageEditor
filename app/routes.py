from flask import Blueprint, render_template, request, send_file
from app.services.image_service import process_image
from io import BytesIO

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload', methods=['POST'])
def upload():
    image_file = request.files.get('image')
    action = request.form.get('action')

    if not image_file:
        return "No image uploaded", 400

    processed_image = process_image(image_file, action)

    return send_file(BytesIO(processed_image), mimetype='image/png')
