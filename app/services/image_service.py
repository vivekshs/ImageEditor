import cv2
import numpy as np

class ImageProcessor:
    def __init__(self, image):
        self.image = image

    def to_bytes(self):
        _, buffer = cv2.imencode('.png', self.image)
        return buffer.tobytes()

    def process(self):
        raise NotImplementedError("Subclasses must implement this method")
    
def apply_processor(image, processor_class, *args):
    processor = processor_class(image, *args)
    return processor.process()

def process_image(image_file, action, value):
    processors = {
        'brightness': Brightness,
        'grayscale': Grayscale,
        'blur': Blur,
        'contrast': Contrast,
        'exposure': Exposure,
        'brilliance': Brilliance,
        'highlight': Highlight,
        'shadows': Shadows,
        'vignette': Vignette,
        'noise_reduction': NoiseReduction,
        'sharpness': Sharpness,
    }

    if action not in processors:
        print("Available actions:", processors.keys())
        raise ValueError(f"Invalid action: {action}")

    return apply_processor(image_file, processors[action], value)

class Brightness(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100)

    def process(self):
        self.image = cv2.convertScaleAbs(self.image, alpha=1, beta=self.value)
        return self.to_bytes()

class Grayscale(ImageProcessor):
    def __init__(self, image, intensity):
        super().__init__(image)
        self.intensity = np.clip(intensity, -100, 100) / 100

    def process(self):
        gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        gray_bgr = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
        self.image = cv2.addWeighted(self.image, 1 - self.intensity, gray_bgr, self.intensity, 0)
        return self.to_bytes()

class Blur(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = max(1, value // 2 * 2 + 1)

    def process(self):
        self.image = cv2.GaussianBlur(self.image, (self.value, self.value), 0)
        return self.to_bytes()

class Contrast(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100) / 100 + 1

    def process(self):
        self.image = cv2.convertScaleAbs(self.image, alpha=self.value, beta=0)
        return self.to_bytes()

class Exposure(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100)

    def process(self):
        self.image = cv2.convertScaleAbs(self.image, alpha=1, beta=self.value)
        return self.to_bytes()

class Brilliance(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100) / 100

    def process(self):
        hsv = cv2.cvtColor(self.image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        assert h.shape == s.shape == v.shape

        h = h.astype(np.uint8)
        s = s.astype(np.uint8)
        v = v.astype(np.uint8)

        if self.value > 0:
            # Boost saturation proportionally
            s = np.clip(s * (1 + self.value), 0, 255).astype(np.uint8)
        else:
            # Reduce saturation
            s = np.clip(s * (1 + self.value), 0, 255).astype(np.uint8)

        hsv = cv2.merge((h, s, v))
        assert hsv.shape == self.image.shape
        self.image = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        return self.to_bytes()

class Highlight(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100)

    def process(self):
        hls = cv2.cvtColor(self.image, cv2.COLOR_BGR2HLS).astype(np.float32)
        h, l, s = cv2.split(hls)
        mask = l > 180  
        return self.to_bytes()

class Shadows(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100)

    def process(self):
        mask = self.image < 50
        self.image = np.where(mask, np.clip(self.image + self.value, 0, 255), self.image).astype(np.uint8)
        return self.to_bytes()

class NoiseReduction(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = max(0, value)

    def process(self):
        self.image = cv2.fastNlMeansDenoisingColored(self.image, None, self.value, self.value, 7, 21)
        return self.to_bytes()

class Vignette(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100) / 100

    def process(self):
        rows, cols = self.image.shape[:2]
        X, Y = np.meshgrid(np.linspace(-1, 1, cols), np.linspace(-1, 1, rows))
        mask = np.sqrt(X ** 2 + Y ** 2)
        mask = np.clip(1 - mask, 0, 1) * (1 - self.value)
        self.image = (self.image * mask[:, :, np.newaxis]).astype(np.uint8)
        return self.to_bytes()

class Sharpness(ImageProcessor):
    def __init__(self, image, value):
        super().__init__(image)
        self.value = np.clip(value, -100, 100) / 100

    def process(self):
        blurred = cv2.GaussianBlur(self.image, (0, 0), 3)
        self.image = cv2.addWeighted(self.image, 1 + self.value, blurred, -self.value, 0)
        return self.to_bytes()
