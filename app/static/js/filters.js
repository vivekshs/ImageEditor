let appliedFilters = {};

function rotateCanvas(direction) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;

    tempCtx.save();

    if (direction === 'left') {
        tempCtx.translate(0, canvas.width);
        tempCtx.rotate(-Math.PI / 2);
    } else if (direction === 'right') {
        tempCtx.translate(canvas.height, 0);
        tempCtx.rotate(Math.PI / 2);
    }

    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.restore();

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    saveState();
    console.log("Canvas rotated:", direction);
}

function flipCanvas(axis) {
    ctx.save();
    
    if (axis === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    } else if (axis === 'vertical') {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
    }

    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    saveState();
    console.log("Canvas flipped:", axis);
}

async function applyFilter(action, value) {
    if (value === undefined || value === null) {
        console.error("Filter value is missing for action:", action);
        return;
    }
    if (!imageId) {
        console.error("No image ID found");
        return;
    }

    if (value === 0) {
        delete appliedFilters[action];
    } else {
        appliedFilters[action] = value;
    }

    try {
        let response = await fetch('/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_id: imageId,
                applied_filters: Object.entries(appliedFilters)
            })
        });

        if (!response.ok) throw new Error("Error applying filter");

        const data = await response.json();
        if (data.image_url) {
            updateCanvasWithNewImage(data.image_url);
        }
    } catch (error) {
        console.error("Error applying filter:", error);
    }
}

async function updateCanvasWithNewImage(imageUrl) {
    try {
        const img = new Image();
        img.onload = () => {
            requestAnimationFrame(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            });
            saveState();
            URL.revokeObjectURL(imageUrl);
        };
        img.onerror = () => console.error("Failed to load image.");
        img.src = imageUrl;
    } catch (error) {
        console.error("Error updating canvas:", error);
    }
}
