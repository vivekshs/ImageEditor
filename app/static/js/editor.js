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
    const imageURL = editorMain.dataset.imageUrl; 

    if (!imageURL) {
        console.error("Image URL not found.");
        return;
    }

    // Convert dimensions based on units
    const convertUnitsToPixels = (value, unit) => {
        if (isNaN(value)) return null;
        switch (unit) {
            case "cm": return value * 37.795; // cm to pixels
            case "in": return value * 96;     // inches to pixels
            default: return value;            // pixels by default
        }
    };

    let pixelWidth = convertUnitsToPixels(width, units) || 800;
    let pixelHeight = convertUnitsToPixels(height, units) || 600;

    // Ensure canvas and editorMain exist
    const editorMain = document.getElementById("editorMain");
    if (!editorMain) {
        console.error("Cannot find 'editorMain' element.");
        return;
    }

    // Reuse or create the canvas
    let canvas = document.getElementById("canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.style.border = "1px solid #000";
        editorMain.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
        canvas.width = pixelWidth || img.width;
        canvas.height = pixelHeight || img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.onerror = () => {
        console.error("Failed to load image from URL: ", imageURL);
    };

    img.src = imageURL;
});
