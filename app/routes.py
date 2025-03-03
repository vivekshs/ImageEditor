from flask import Blueprint, render_template, request, send_file
from app.services.image_service import process_image
from io import BytesIO
import cv2
import numpy as np

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "Image not received", 400
    image_file = request.files['image']
    print(f"Received image: {image_file.filename}")
    action = request.form.get('action')
    value = request.form.get('value', type=int, default=0)

    if not image_file:
        return "No image uploaded", 400

    image = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    processed_image = process_image(image, action, value)

    return send_file(BytesIO(processed_image), mimetype='image/png')
