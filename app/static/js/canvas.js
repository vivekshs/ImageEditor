function initializeCanvas(imageURL, width, height, units) {
    const convertUnitsToPixels = (value, unit) => {
        if (isNaN(value)) return null;
        switch (unit) {
            case "cm": return value * 37.795;
            case "in": return value * 96;
            default: return value;
        }
    };

    let pixelWidth = convertUnitsToPixels(width, units) || 800;
    let pixelHeight = convertUnitsToPixels(height, units) || 600;

    let canvas = document.getElementById("canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.getElementById("editorMain").appendChild(canvas);
    }

    const MAX_WIDTH = 800;
    const MAX_HEIGHT = 600;

    const ctx = canvas.getContext("2d");

    const adjustCanvasSize = (originalWidth, originalHeight) => {
        let scaleRatio = Math.min(MAX_WIDTH / originalWidth, MAX_HEIGHT / originalHeight, 1);

        const displayWidth = originalWidth * scaleRatio;
        const displayHeight = originalHeight * scaleRatio;

        canvas.width = originalWidth;
        canvas.height = originalHeight;

        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
    };

    if (imageURL && imageURL !== 'None') {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            adjustCanvasSize(img.width, img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            console.log("Image rendered successfully.");
        };
        img.onerror = () => console.error("Failed to load image from URL:", imageURL);
        img.src = imageURL;
    } else {
        adjustCanvasSize(pixelWidth, pixelHeight);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const download = document.getElementById('download');
download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'adjusted_image.png';
    link.href = canvas.toDataURL();
    link.click();
});