document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const width = parseFloat(urlParams.get("width"));
    const height = parseFloat(urlParams.get("height"));
    const units = urlParams.get("units");
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const flipHorizontalBtn = document.getElementById('horizontal-flip');
    const flipVerticalBtn = document.getElementById('Vertical-flip');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('download');
    const menuHeader = document.getElementById("menuHeader");

    const imageURL = editorMain.dataset.imageUrl; 
    if (!imageURL) {
        console.error("Image URL not found.");
        return;
    }
    initializeCanvas(imageURL, width, height, units);

    saveState(console.log("initialized"));

    rotateLeftBtn.addEventListener('click', () => rotateCanvas('left'));
    rotateRightBtn.addEventListener('click', () => rotateCanvas('right'));
    flipHorizontalBtn.addEventListener('click', () => flipCanvas('horizontal'));
    flipVerticalBtn.addEventListener('click', () => flipCanvas('vertical'));
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    saveBtn.addEventListener('click', saveState);
    downloadBtn.addEventListener('click', download);

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

    observeCanvas(saveState);
});
function toggleSublist() {
    const sublist = document.getElementById("filterSublist");
    if (sublist) {
        sublist.style.display = (sublist.style.display === "block") ? "none" : "block";
    }
}

let imageId = null;

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    imageId = urlParams.get('image_id');
    console.log("Extracted Image ID:", imageId);
};