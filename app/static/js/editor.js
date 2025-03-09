console.log("editor.js loaded!");

function toggleSublist() {
    const sublist = document.getElementById("filterSublist");
    if (sublist) {
        sublist.style.display = (sublist.style.display === "block") ? "none" : "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const width = parseFloat(urlParams.get("width"));
    const height = parseFloat(urlParams.get("height"));
    const units = urlParams.get("units");

    // Ensure #editorMain exists after DOM is fully loaded
    const editorMain = document.getElementById("editorMain");
    if (!editorMain) {
        console.error("Cannot find 'editorMain' element.");
        return;
    }

    const imageURL = editorMain.dataset.imageUrl; 
    if (!imageURL) {
        console.error("Image URL not found.");
        return;
    }

    // Helper function: Convert units to pixels
    const convertUnitsToPixels = (value, unit) => {
        if (isNaN(value)) return null;
        switch (unit) {
            case "cm": return value * 37.795; // cm to pixels
            case "in": return value * 96;     // inches to pixels
            default: return value;            // pixels by default
        }
    };

    // let pixelWidth = convertUnitsToPixels(width, units) || 800;
    // let pixelHeight = convertUnitsToPixels(height, units) || 600;

    // Create or reuse canvas
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "canvas";
        editorMain.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");

    // Load and draw image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        canvas.width = img.width || pixelWidth;
        canvas.height = img.height || pixelHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        console.log("Image rendered successfully.");
    };

    img.onerror = () => {
        console.error("Failed to load image from URL:", imageURL);
    };

    img.src = imageURL;
});

const download = document.getElementById('download');
download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'adjusted_image.png';
    link.href = canvas.toDataURL();
    link.click();
});

const floatingMenu = document.getElementById("floatingMenu");
const menuHeader = document.getElementById("menuHeader");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

menuHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingMenu.offsetLeft;
    offsetY = e.clientY - floatingMenu.offsetTop;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Ensure the menu doesn't go outside the viewport
        const maxX = window.innerWidth - floatingMenu.offsetWidth;
        const maxY = window.innerHeight - floatingMenu.offsetHeight;

        floatingMenu.style.left = `${Math.min(Math.max(0, newX), maxX)}px`;
        floatingMenu.style.top = `${Math.min(Math.max(0, newY), maxY)}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "auto"; // Restore text selection
});
