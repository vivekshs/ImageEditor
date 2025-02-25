const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const filterSelect = document.getElementById('filterSelect');
const downloadBtn = document.getElementById('downloadBtn');

let currentImage = null;

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            currentImage = img;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function applyFilter() {
    if (!currentImage) return alert("Upload an image first!");

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('action', filterSelect.value);

    fetch('/upload', { method: 'POST', body: formData })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                downloadBtn.style.display = 'block';
            };
            img.src = url;
        })
        .catch(err => alert("Error: " + err.message));
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

document.addEventListener('DOMContentLoaded', function() {
    loadPage('home');

    document.getElementById('create-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('/create_design', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(() => loadPage('home'));
    });
});

function loadPage(page) {
    fetch('/load_page', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({ page: page })
    }).then(response => response.text())
      .then(html => document.getElementById('page-content').innerHTML = html);
}
