const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const middlebar = document.getElementById("middlebar");
const mainContainer = document.getElementById("mainContainer");

let isOpen = false;

    function recentTemp() {
        const icon = document.getElementById("arrowIcon");
        const lowerContent = document.getElementById("lowerContent");

        if (!isOpen) {
            icon.classList.remove("fa-arrow-right");
            icon.classList.add("fa-arrow-down");
            lowerContent.style.display = "none";
        } else {
            icon.classList.remove("fa-arrow-down");
            icon.classList.add("fa-arrow-right");
            lowerContent.style.display = "block";
        }

        isOpen = !isOpen;
        }


menuBtn.addEventListener("click", () => {
    console.log("clicked");
    sidebar.classList.toggle("collapsed");
    
    middlebar.classList.toggle("hidden");

    mainContainer.classList.toggle("expanded");
});

// Modal handling
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

const toggleModal = (modal, action) => {
    if (!modal) return;
    modal.classList.toggle('active', action);
    overlay.classList.toggle('active', action);
};

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector('.popup');
    if (overlay && popup) toggleModal(popup, false);
});

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        toggleModal(modal, true);
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleModal(button.closest('.popup'), false);
    });
});

overlay.addEventListener('click', () => {
    document.querySelectorAll('.popup.active').forEach(modal => toggleModal(modal, false));
});

// Form validation
const form = document.getElementById("customSizeForm");
const createButton = document.getElementById("createButton");
const inputs = form?.querySelectorAll("input, select") || [];

const checkForm = () => {
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
    createButton.disabled = !allFilled;
    createButton.classList.toggle("active", allFilled);
};

inputs.forEach(input => input.addEventListener("input", checkForm));
checkForm();

// Content switching
const targetButtons = document.querySelectorAll('[data-target]');

const switchContent = (targetId) => {
    document.querySelectorAll('.custom-size-container').forEach(div => {
        div.classList.add('hidden');
        div.style.display = 'none';
    });

    const targetDiv = document.querySelector(targetId);
    if (targetDiv) {
        targetDiv.classList.remove('hidden');
        targetDiv.style.display = 'block';
    }
};

targetButtons.forEach(button => {
    button.addEventListener('click', () => switchContent(button.getAttribute('data-target')));
});

// Sidebar navigation
const setupSidebarNavigation = () => {
    const customSizeButton = document.querySelector('[data-target="#custom-size-content"]');
    const uploadButton = document.querySelector('.popup-sidebar-main ul li:nth-child(2)');
    const allListItems = document.querySelectorAll(".popup-sidebar-main ul li");
    const allContents = document.querySelectorAll(".popup-main-header > div");

    const handleButtonClick = (button, contentToShow) => {
        allListItems.forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        allContents.forEach(section => {
            section.classList.add("hidden");
            section.style.display = "none";
        });

        if (contentToShow) {
            contentToShow.classList.remove("hidden");
            contentToShow.style.display = "block";
        }
    };

    customSizeButton?.addEventListener("click", (e) => {
        e.preventDefault();
        handleButtonClick(customSizeButton, document.querySelector("#custom-size-content"));
    });

    uploadButton?.addEventListener("click", (e) => {
        e.preventDefault();
        handleButtonClick(uploadButton, document.querySelector(".upload-container"));
    });

    handleButtonClick(customSizeButton, document.querySelector("#custom-size-content"));
};

document.addEventListener("DOMContentLoaded", setupSidebarNavigation);

//Upload Btn
// Get DOM Elements
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

// Trigger File Input on Click
uploadBox.addEventListener('click', () => fileInput.click());
uploadBtn.addEventListener('click', () => fileInput.click());

// Handle Drag & Drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#0073e6';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '#ccc';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#ccc';

    if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

// Handle File Input Change
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        handleImageUpload(fileInput.files[0]);
    }
});
document.getElementById("uploadBtn").addEventListener("click", uploadImage);

// Upload Image Function
async function handleImageUpload(file) {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Redirect to the editor page
        window.location.href = response.url;

    } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image. Please try again.");
    }
}

