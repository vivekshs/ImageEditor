import threading
from flask import Blueprint, render_template, request, send_file, redirect, url_for, jsonify
from io import BytesIO
import cv2
import numpy as np
import uuid
import time

from app.services.image_service import process_image

main = Blueprint('main', __name__)

image_store = {}

class NonClosingBytesIO(BytesIO):
    def close(self):
        pass

def cleanup_images(timeout=3600):
    """ Remove images older than timeout (in seconds). """
    now = time.time()
    for image_id, (timestamp, _) in list(image_store.items()):
        if now - timestamp > timeout:
            del image_store[image_id]

threading.Thread(target=cleanup_images, daemon=True).start()

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "Image not received", 400

    image_file = request.files['image']
    if image_file.filename == '':
        return "No image uploaded", 400

    try:
        image_bytes = image_file.read()
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Invalid image format")
    except Exception as e:
        return f"Image decoding failed: {e}", 400

    image_id = str(uuid.uuid4())
    image_store[image_id] = (time.time(), NonClosingBytesIO(image_bytes))

    return redirect(url_for('main.editor', image_id=image_id))

@main.route('/image/<image_id>')
def get_image(image_id):
    if image_id not in image_store:
        print(f"Image ID not found: {image_id}")
        return "Image not found", 404
    print(f"Serving image for ID: {image_id}")
    _, image_buffer = image_store[image_id]
    image_buffer.seek(0)
    return send_file(image_buffer, mimetype='image/png')


@main.route('/editor')
def editor():
    image_id = request.args.get('image_id')
    width = request.args.get('width')
    height = request.args.get('height')
    units = request.args.get('units')

    if image_id:
        if image_id not in image_store:
            return "Invalid image ID", 400
        image_url = url_for('main.get_image', image_id=image_id, _external=True)
    else:
        image_url = None

    actions = ['brightness', 'grayscale', 
               'blur', 'contrast', 'exposure', 'brilliance', 'highlight', 
               'shadows', 'vignette', 'noise_reduction', 'sharpness']

    return render_template('editor.html', actions=actions, image_url=image_url, width=width, height=height, units=units)

@main.route('/process', methods=['POST'])
def process():
    data = request.json
    image_id = data.get('image_id')
    action = data.get('action')
    value = data.get('value')

    try:
        value = int(value)
    except ValueError:
        return jsonify({'error': 'Invalid value parameter'}), 400

    if image_id not in image_store:
        return jsonify({'error': 'Image not found'}), 404

    _,image_buffer = image_store[image_id]

    image_buffer.seek(0)
    image_data = image_buffer.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

    processed_image_bytes = process_image(image, action, value)
    image_buffer.seek(0)
    image_buffer.truncate()
    image_buffer.write(processed_image_bytes)
    image_buffer.seek(0)

    return jsonify({"image_url": url_for('main.get_image', image_id=image_id, _external=True)})

