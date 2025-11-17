const accordionheaders = document.querySelectorAll(".accordion-header");
const accordioncontents = document.querySelectorAll(".accordion-content");
accordionheaders.forEach((header) => {
    header.addEventListener("click", () => {
        const accordionitem = header.parentElement;
        const accordioncontent = accordionitem.querySelector(".accordion-content");

        accordioncontents.forEach((content) => {
            if (content !== accordioncontent) {
                content.classList.remove("active");
                content.style.maxHeight = "0";
            }
        });

        accordioncontent.classList.toggle("active");

        if (accordioncontent.classList.contains("active")) {
            accordioncontent.style.maxHeight = accordioncontent.scrollHeight + "px";

        }
        else {
            accordioncontent.style.maxHeight = "0";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('cv-file-input');
    const fileDisplayText = document.querySelector('.file-display-text');
    const defaultText = 'Upload CV'; // Store the default text

    // Set initial text
    if (fileDisplayText) {
        fileDisplayText.textContent = defaultText;
    }

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                // Change text to the selected file name
                fileDisplayText.textContent = this.files[0].name;
            } else {
                // Reset if the user cancels the dialog
                fileDisplayText.textContent = defaultText; 
            }
        });
    }
});