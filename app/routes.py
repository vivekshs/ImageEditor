from flask import Blueprint, render_template, request, send_file, redirect, url_for
from werkzeug.utils import secure_filename
from io import BytesIO
import cv2
import numpy as np
import uuid
import time

main = Blueprint('main', __name__)

# Store images with timestamp for cleanup
image_store = {}

def cleanup_images(timeout=3600):
    """ Remove images older than timeout (in seconds). """
    now = time.time()
    for image_id, (timestamp, _) in list(image_store.items()):
        if now - timestamp > timeout:
            del image_store[image_id]

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

    filename = secure_filename(image_file.filename)  # Security best practice
    print(f"Received image: {filename}")

    # Convert uploaded image to OpenCV format
    try:
        image = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Invalid image format")
    except Exception as e:
        return f"Image decoding failed: {e}", 400

    # Generate unique ID and store image
    image_id = str(uuid.uuid4())
    _, buffer = cv2.imencode('.png', image)
    image_store[image_id] = (time.time(), BytesIO(buffer))

    # Cleanup old images
    cleanup_images()

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
    if not image_id or image_id not in image_store:
        return "Invalid image ID", 400

    image_url = url_for('main.get_image', image_id=image_id, _external=True)
    print(f"Image URL: {image_url}") 

    actions = [
        "rotate_left", "rotate_right", "flip", "brightness",
        "contrast", "grayscale", "blur", "exposure",
        "brilliance", "highlight", "shadows", "vignette",
        "noise_reduction", "sharpness"
    ]

    return render_template('editor.html', actions=actions, image_url=image_url)
