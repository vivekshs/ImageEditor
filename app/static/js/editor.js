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
    initializeCanvas(imageURL, width, height, units);
});

const menuHeader = document.getElementById("menuHeader");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

menuHeader.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - floatingMenu.offsetLeft;
    offsetY = e.clientY - floatingMenu.offsetTop;
    document.body.style.userSelect = "none";
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
    document.body.style.userSelect = "auto";
});
