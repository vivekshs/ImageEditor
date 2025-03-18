let history = [];
let redoStack = [];
let canvas, ctx;

function convertUnitsToPixels(value, unit) {
    if (isNaN(value)) return null;
    switch (unit) {
        case "cm": return value * 37.795;
        case "in": return value * 96;
        default: return value;
    }
}

function createCanvas(parentId = "editorMain") {
    canvas = document.getElementById("canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.getElementById(parentId).appendChild(canvas);
    }
    ctx = canvas.getContext("2d");
}

function adjustCanvasSize(originalWidth, originalHeight) {
    const MAX_WIDTH = 800, MAX_HEIGHT = 600;
    let scaleRatio = Math.min(MAX_WIDTH / originalWidth, MAX_HEIGHT / originalHeight, 1);

    canvas.width = originalWidth;
    canvas.height = originalHeight;

    canvas.style.width = `${originalWidth * scaleRatio}px`;
    canvas.style.height = `${originalHeight * scaleRatio}px`;
}

function loadImageOnCanvas(imageURL, width, height, units) {
    let pixelWidth = convertUnitsToPixels(width, units);
    let pixelHeight = convertUnitsToPixels(height, units);

    if (imageURL && imageURL !== 'None') {
        img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            adjustCanvasSize(img.width, img.height);
            requestAnimationFrame(() => ctx.drawImage(img, 0, 0, img.width, img.height));
        };
        img.onerror = () => console.error("Failed to load image from URL:", imageURL);
        img.src = imageURL;
    } else {
        adjustCanvasSize(pixelWidth, pixelHeight);
        ctx.fillStyle = "#ffffff";
        requestAnimationFrame(() => ctx.fillRect(0, 0, canvas.width, canvas.height));
    }
}

function saveState() {
        history.push(canvas.toDataURL());
        redoStack = [];
}

function restoreState(state) {
    const img = new Image();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = state;
}

function undo() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        restoreState(history[history.length - 1]);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        history.push(nextState);
        restoreState(nextState);
    }
}

function download(filename = "image.png") {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
}

function observeCanvas(callback) {
    if (typeof callback === "function" && canvas) {
        const observer = new MutationObserver(callback);
        observer.observe(canvas, { attributes: true, childList: true, subtree: true });
    }
}

function initializeCanvas(imageURL, width, height, units) {
    createCanvas();
    loadImageOnCanvas(imageURL, width, height, units);
    observeCanvas(saveState);
}
