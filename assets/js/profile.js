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
  const defaultText = 'Upload CV';
  if (fileDisplayText) {
    fileDisplayText.textContent = defaultText;
  }

  if (fileInput) {
    fileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) {
        fileDisplayText.textContent = this.files[0].name;
      } else {
        fileDisplayText.textContent = defaultText;
      }
    });
  }


});
document.addEventListener("DOMContentLoaded", () => {
  function setupDatePicker(wrapper) {
    const input = wrapper.querySelector(".dateInput");
    const dropdown = wrapper.querySelector(".prof-date-dropdown");
    const months = wrapper.querySelectorAll(".months div");
    const yearsBox = wrapper.querySelector(".years");

    let selectedMonth = null;
    let selectedYear = null;

    if (!yearsBox.dataset.loaded) {
      const current = new Date().getFullYear();
      for (let y = current; y >= 1980; y--) {
        const el = document.createElement("div");
        el.textContent = y;
        el.dataset.year = y;
        yearsBox.appendChild(el);
      }
      yearsBox.dataset.loaded = "true";
    }

    input.addEventListener("click", (e) => {
      dropdown.style.display =
        dropdown.style.display === "grid" ? "none" : "grid";
      e.stopPropagation();

      highlight(months, "month", selectedMonth);
      highlight(yearsBox.children, "year", selectedYear);
    });

    months.forEach((m) =>
      m.addEventListener("click", () => {
        selectedMonth = m.dataset.month;
        highlight(months, "month", selectedMonth);
        updateInput();
      })
    );

    yearsBox.addEventListener("click", (e) => {
      if (e.target.dataset.year) {
        selectedYear = e.target.dataset.year;
        highlight(yearsBox.children, "year", selectedYear);
        updateInput();
      }
    });

    function updateInput() {
      if (selectedMonth) {
        input.value = `${selectedMonth}/${selectedYear || "YY"}`;
      }
      if (selectedMonth && selectedYear) {
        input.value = `${selectedMonth}/${selectedYear}`;
        dropdown.style.display = "none";
      }
    }

    function highlight(list, type, value) {
      [...list].forEach((el) => {
        el.classList.toggle("selected", el.dataset[type] == value);
      });
    }

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) dropdown.style.display = "none";
    });
  }
  document.querySelectorAll(".date-picker").forEach(setupDatePicker);
});

document.addEventListener("input", function (e) {
  if (e.target.classList.contains("bullet-editor")) {
    let html = e.target.innerHTML.trim();
    if (!html.startsWith("<ul")) {
      e.target.innerHTML = "<ul><li>" + html + "</li></ul>";
      placeCaretAtEnd(e.target);
    }
  }
});

function placeCaretAtEnd(element) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}