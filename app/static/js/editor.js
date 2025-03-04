console.log("editor.js loaded!");

function toggleSublist() {
    const sublist = document.getElementById("filterSublist");
    if (sublist.style.display === "block") {
        sublist.style.display = "none";
    } else {
        sublist.style.display = "block";
    }
}

// Run when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const width = urlParams.get("width");
    const height = urlParams.get("height");
    const units = urlParams.get("units");

    // Check if width, height, and units are present
    if (width && height && units) {
        // Convert size to pixels if needed
        let pixelWidth = parseFloat(width);
        let pixelHeight = parseFloat(height);

        if (units === "cm") {
            pixelWidth *= 37.795;   // 1 cm ≈ 37.795 px
            pixelHeight *= 37.795;
        } else if (units === "in") {
            pixelWidth *= 96;       // 1 in ≈ 96 px
            pixelHeight *= 96;
        }

        // Create a canvas
        const canvas = document.createElement("canvas");
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        canvas.style.border = "1px solid #000";

        // Get the editorMain div and append the canvas
        const editorMain = document.getElementById("editorMain");
        if (editorMain) {
            editorMain.appendChild(canvas);
        } else {
            console.error("Cannot find element with id 'editorMain'");
        }
    } else {
        console.error("Width, height, or units parameter is missing in URL.");
    }
});
