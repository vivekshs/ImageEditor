const imageInput = document.getElementById('Upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const Slider = document.getElementById('Slider');
const download = document.getElementById('download');

let currentFile = null;

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return print("No file selected.");

    currentFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});


Slider.addEventListener('input', () => {
    if (currentFile) {
        updateBrightness(currentFile, Slider.value);
    }
});


async function updateBrightness(imageFile, exposure) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('action', 'sharpness'); 
    formData.append('value', exposure);

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        const blob = await response.blob();
        displayImage(URL.createObjectURL(blob));
    } catch (err) {
        console.error("Error updating brightness:", err);
    }
}
function displayImage(imageUrl) {
    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
}

download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'adjusted_image.png';
    link.href = canvas.toDataURL();
    link.click();
});

