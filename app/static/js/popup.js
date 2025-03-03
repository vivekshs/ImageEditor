const openModalButtons=document.querySelectorAll('[data-modal-target]')
const closeModalButtons=document.querySelectorAll('[data-close-button]')
const overlay=document.getElementById('overlay')

openModalButtons.forEach(button=>{
    button.addEventListener('click',()=>{
        const modal=document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})
overlay.addEventListener('click',()=>{
    const modals=document.querySelectorAll('.popup.active')
    modals.forEach(modal=>{
        closeModal(modal)
    })
})
closeModalButtons.forEach(button=>{
    button.addEventListener('click',()=>{
        const modal=button.closest('.popup')
        closeModal(modal)
    })
})
function openModal(modal){
    if(modal==null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal){
    if(modal==null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}
document.querySelector('.popup').classList.add('active');
document.querySelector('.popup').style.display = 'grid';  
document.querySelector('.popup').style.gridTemplateColumns = '1fr 3fr';  

// Get form elements
const form = document.getElementById("customSizeForm");
const createButton = document.getElementById("createButton");
const inputs = form.querySelectorAll("input, select");

// Check if all inputs have values
function checkForm() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value === "") {
            allFilled = false;
        }
    });

    if (allFilled) {
        createButton.disabled = false;
        createButton.classList.add("active");
    } else {
        createButton.disabled = true;
        createButton.classList.remove("active");
    }
}

// Listen for input changes
inputs.forEach(input => {
    input.addEventListener("input", checkForm);
});

// Run check on page load
checkForm();

const targetButtons = document.querySelectorAll('[data-target]');

targetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetDiv = document.querySelector(targetId);

        // Hide all popup content first
        document.querySelectorAll('.custom-size-container').forEach(div => {
            div.classList.add('hidden');
            div.style.display = 'none'; 
        });

        // Show the targeted div
        if (targetDiv) {
            targetDiv.classList.remove('hidden');
            targetDiv.style.display = 'block'; 
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('overlay');
    const popup = document.querySelector('.popup');

    // Show overlay and popup if they exist
    if (overlay && popup) {
        overlay.classList.add('active');
        popup.classList.add('active');
        popup.style.display = 'grid';  
        popup.style.gridTemplateColumns = '1fr 3fr';  
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const customSizeButton = document.querySelector('[data-target="#custom-size-content"]');
    const uploadButton = document.querySelector('.popup-sidebar-main ul li:nth-child(2)');
    const customSizeContent = document.querySelector("#custom-size-content");
    const uploadContent = document.querySelector(".upload-container");
    const allListItems = document.querySelectorAll(".popup-sidebar-main ul li");
    const allContents = document.querySelectorAll(".popup-main-header > div");

    // Hide all containers by default
    allContents.forEach(section => {
        section.classList.add("hidden");
        section.style.display = "none";  // Ensure all sections are hidden initially
    });

    // Function to handle button clicks
    function handleButtonClick(button, contentToShow) {
        // Remove active class from all list items
        allListItems.forEach(item => item.classList.remove("active"));

        // Add active class to the clicked item
        button.classList.add("active");

        // Hide all content sections
        allContents.forEach(section => {
            section.classList.add("hidden");
            section.style.display = "none";  // Ensure all sections are hidden
        });

        // Show the selected content
        if (contentToShow) {
            contentToShow.classList.remove("hidden");
            contentToShow.style.display = "block";  // Display the targeted section
        }
    }

    // Event listener for Custom Size button
    customSizeButton.addEventListener("click", function (event) {
        event.preventDefault();
        handleButtonClick(customSizeButton, customSizeContent);
    });

    // Event listener for Upload button
    uploadButton.addEventListener("click", function (event) {
        event.preventDefault();
        handleButtonClick(uploadButton, uploadContent);
    });

    // Show Custom Size by default on page load
    handleButtonClick(customSizeButton, customSizeContent);
});

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file");
    const uploadButton = document.getElementById("uploadButton");

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {  // Check if a file is selected
            uploadButton.disabled = false;         // Enable the button
            uploadButton.classList.add("active");  // Add active class for styling
        } else {
            uploadButton.disabled = true;          // Disable the button if no file is selected
            uploadButton.classList.remove("active");  // Remove active class
        }
    });
});


