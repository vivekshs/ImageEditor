# pip3 install flask opencv-python
from flask import Flask, render_template, request, flash, redirect, url_for
from werkzeug.utils import secure_filename
import cv2
import os

# Configuration
UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
ALLOWED_EXTENSIONS = {'png', 'webp', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.secret_key = 'super secret key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure required folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Process the image based on the requested operation
def process_image(filename, operation):
    try:
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        img = cv2.imread(input_path)

        if img is None:
            raise ValueError("Invalid image file")

        match operation:
            case "cgray":
                img_processed = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                new_filename = f"{filename.split('.')[0]}_gray.jpg"
            case "cwebp":
                new_filename = f"{filename.split('.')[0]}.webp"
            case "cjpg":
                new_filename = f"{filename.split('.')[0]}.jpg"
            case "cpng":
                new_filename = f"{filename.split('.')[0]}.png"
            case _:
                raise ValueError("Unsupported operation")

        output_path = os.path.join(STATIC_FOLDER, new_filename)
        cv2.imwrite(output_path, img_processed if 'img_processed' in locals() else img)
        return new_filename

    except Exception as e:
        print(f"Error processing image: {e}")
        return None

# Routes
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/edit", methods=["GET", "POST"])
def edit():
    if request.method == "POST":
        operation = request.form.get("operation")

        # Check if a file is provided
        if 'file' not in request.files:
            flash('No file part in the request')
            return redirect(request.url)

        file = request.files['file']

        # Check if a valid file is selected
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Process the image
            new_filename = process_image(filename, operation)
            if new_filename:
                flash(f"Your image has been processed and is available <a href='/{STATIC_FOLDER}/{new_filename}' target='_blank'>here</a>", "success")
            else:
                flash("Error processing the image. Please try again.", "error")

            return redirect(url_for("home"))

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
