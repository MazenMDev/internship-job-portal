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
window.onload = function () {
  const yearsContainer = document.getElementById("years");
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= 1980; year--) {
    const yearDiv = document.createElement("div");
    yearDiv.textContent = year;
    yearDiv.dataset.year = year;
    yearsContainer.appendChild(yearDiv);
  }

  const dateInput = document.getElementById("dateInput");
  const date = document.getElementById("prof-date-dropdown");
  let selectedMonth = null;

  dateInput.addEventListener("click", function (event) {
    date.style.display = date.style.display === "flex" ? "none" : "flex";
    event.stopPropagation();
  });

  document.querySelectorAll(".months div").forEach((month) => {
    month.addEventListener("click", function () {
      selectedMonth = this.dataset.month;
    });
  });

  document.addEventListener("click", function (event) {
    if (!date.contains(event.target) && event.target !== dateInput) {
      date.style.display = "none";
    }
  });

  yearsContainer.addEventListener("click", function (event) {
    if (event.target.tagName === "DIV") {
      const year = event.target.dataset.year;
      if (selectedMonth) {
        dateInput.value = `${selectedMonth}/${year}`;
        date.style.display = "none";
        selectedMonth = null;
      }
    }
  });
};
