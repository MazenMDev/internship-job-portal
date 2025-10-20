const toggleLink = document.querySelector(".edit-btn");
const allHiddenDivs = document.querySelectorAll(".edit");
const textToEdit = document.querySelector(".headline.editedtext");

toggleLink.addEventListener("click", (event) => {
  event.preventDefault();
  textToEdit.setAttribute("contenteditable", textToEdit.getAttribute("contenteditable") !== 'true');
  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Select all the elements from your HTML.
    // Note: Selecting the main edit button by its class '.edit-photo'
    const editButton = document.querySelector('.edit-photo'); 
    const saveButton = document.getElementById('saveButton');
    const discardButton = document.getElementById('discardButton');
    const editableFields = document.querySelectorAll('.editedtext');

    // This array will hold the original text before you start editing.
    let originalContent = []; 

    // Step 2: Create a function to switch between viewing and editing modes.
    function toggleMode(isEditing) {
        // Show/hide the correct buttons based on the mode.
        if (editButton) {
            editButton.classList.toggle('hidden', isEditing);
        }
        if (saveButton) {
            saveButton.classList.toggle('hidden', !isEditing);
        }
        if (discardButton) {
            discardButton.classList.toggle('hidden', !isEditing);
        }

        // Loop through every editable field and make it either editable or read-only.
        editableFields.forEach(field => {
            field.setAttribute('contenteditable', isEditing);
        });
    }

    // --- Button Actions ---

    // Step 3: Define what happens when the EDIT button is clicked.
    if (editButton) {
        editButton.addEventListener('click', () => {
            // First, save the current content of each field into our array.
            originalContent = []; // Clear any old saved content.
            editableFields.forEach(field => {
                originalContent.push(field.innerHTML);
            });
            
            // Now, switch the page to edit mode.
            toggleMode(true); 
        });
    }

    // Step 4: Define what happens when the SAVE button is clicked.
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Switch the page back to view mode.
            toggleMode(false); 
            
            // In a real application, you would send the new content to your server here.
            editableFields.forEach((field, index) => {
                console.log(`Saving field ${index}:`, field.innerHTML);
            });
            alert('Changes saved! (Check the browser console)');
        });
    }

    // Step 5: Define what happens when the DISCARD button is clicked.
    if (discardButton) {
        discardButton.addEventListener('click', () => {
            // Restore the original content that we saved earlier.
            editableFields.forEach((field, index) => {
                field.innerHTML = originalContent[index];
            });
            
            // Switch the page back to view mode.
            toggleMode(false); 
        });
    }
});