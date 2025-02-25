import cv2
import numpy as np

def process_image(image_file, action):

    image_data = np.frombuffer(image_file.read(), np.uint8)
    image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)

    if action == 'grayscale':
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    elif action == 'blur':
        image = cv2.GaussianBlur(image, (15, 15), 0)
    elif action == 'rotate':
        height, width = image.shape[:2]
        matrix = cv2.getRotationMatrix2D((width / 2, height / 2), 90, 1)
        image = cv2.warpAffine(image, matrix, (width, height))
    elif action == 'contrast':
        image = cv2.convertScaleAbs(image, alpha=1.5, beta=0)

    _, img_encoded = cv2.imencode('.png', image)

    return img_encoded.tobytes()
