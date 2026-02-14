const profileList = [];
const coursesList = [];
const experienceList = [];
const educationList = [];
const projectsList = [];
const skillsList = [];
const profileData = {
  profile: profileList,
  courses: coursesList,
  experience: experienceList,
  education: educationList,
  projects: projectsList,
  skills: skillsList,
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".edit-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }
});

function saveAllDataToBackend() {
  const payload = {
    experience: experienceList,
    education: educationList,
    courses: coursesList,
    projects: projectsList,
    skills: skillsList,
  };

  fetch("../php/profile_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        //console.log("Auto-saved to database");
      } else {
        console.error("Save failed", data);
      }
    })
    .catch((err) => console.error("Error saving:", err));
}

/* EDIT PANEL*/
document.addEventListener("DOMContentLoaded", () => {
  const accordionheaders = document.querySelectorAll(".accordion-header");
  const accordioncontents = document.querySelectorAll(".accordion-content");

  accordionheaders.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionitem = header.parentElement;
      const accordioncontent =
        accordionitem.querySelector(".accordion-content");

      accordioncontents.forEach((content) => {
        if (content !== accordioncontent) {
          content.classList.remove("active");
          content.style.maxHeight = "0px";
          const otherHeader =
            content.parentElement.querySelector(".accordion-header");
          if (otherHeader) otherHeader.classList.remove("active");
        }
      });

      accordioncontent.classList.toggle("active");
      accordioncontent.style.maxHeight = accordioncontent.classList.contains(
        "active",
      )
        ? accordioncontent.scrollHeight + "10px"
        : "0px";
    });
  });
});

/* CV UPLOAD*/
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("cv-file-input");
  const fileDisplayText = document.querySelector(".file-display-text");

  if (fileDisplayText) fileDisplayText.textContent = "Upload CV";

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      fileDisplayText.textContent = this.files?.length
        ? this.files[0].name
        : "Upload CV";
    });
  }
});

function deduceTargetFromButton(btn) {
  const accItem = btn.closest(".accordion-item");
  if (!accItem) return null;
  const header = accItem.querySelector(".accordion-header");
  if (!header) return null;
  const txt = header.textContent.trim().split("\n")[0].trim();
  if (!txt) return null;
  return txt.toLowerCase().split(" ")[0];
}
// code for adding new entry forms
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-entry-btn")) return;

  let target = e.target.dataset.target;
  if (!target) target = deduceTargetFromButton(e.target);

  if (!target) {
    console.warn("Could not determine add-entry target for button:", e.target);
    return;
  }

  const containerSelector = `.${target}-forms-container`;
  let container = document.querySelector(containerSelector);

  if (!container) {
    const accContent = e.target.closest(".accordion-content");
    container = document.createElement("div");
    container.classList.add(`${target}-forms-container`);
    accContent.insertBefore(container, e.target);
  }
  if (
    container.querySelector(".entry-form") ||
    container.querySelector(".course-form")
  ) {
    alert("Please finish the open form first.");
    return;
  }

  const isCourse = target === "courses";
  const iseducation = target === "education";
  const isprojects = target === "projects";
  const isexperience = target === "experience";
  const form = document.createElement("div");
  form.classList.add(isCourse ? "course-form" : "entry-form");
  form.innerHTML = `
    <div class="edit-row">
      <label>Edit Existing</label>
      <div class="edit-controls">
          <select class="edit-entry-select">
            <option value="">-- Select existing ${target} --</option>
          </select>
          <button type="button" class="delete-entry-btn" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="lucide lucide-trash2-icon lucide-trash-2">
                  <path d="M10 11v6"/>
                  <path d="M14 11v6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                  <path d="M3 6h18"/>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
          </button>
      </div>
    </div>

    ${
      !isprojects
        ? `
        <label>Title</label>
        <textarea class="title-input" required></textarea>

        <label>${isCourse ? "Institution" : ""}
        ${iseducation ? "School/University" : ""}
        ${isexperience ? "Company" : ""}
        </label>
        <textarea class="institution-input"></textarea>

        <div class="date-picker" date-type="start">
          <label>Start Date</label>
          <input type="text" class="dateInput start-date" placeholder="MM/YYYY" readonly>
          <div class="prof-date-dropdown">
            <div class="months">
              <div data-month="01">Jan</div><div data-month="02">Feb</div>
              <div data-month="03">Mar</div><div data-month="04">Apr</div>
              <div data-month="05">May</div><div data-month="06">Jun</div>
              <div data-month="07">Jul</div><div data-month="08">Aug</div>
              <div data-month="09">Sep</div><div data-month="10">Oct</div>
              <div data-month="11">Nov</div><div data-month="12">Dec</div>
            </div>
            <div class="divider"></div>
            <div class="years"></div>
          </div>
        </div>

        <div class="date-picker" date-type="end">
          <label>End Date</label>
          <input type="text" class="dateInput end-date" placeholder="MM/YYYY" readonly>
          <div class="prof-date-dropdown">
            <div class="months">
              <div data-month="01">Jan</div><div data-month="02">Feb</div>
              <div data-month="03">Mar</div><div data-month="04">Apr</div>
              <div data-month="05">May</div><div data-month="06">Jun</div>
              <div data-month="07">Jul</div><div data-month="08">Aug</div>
              <div data-month="09">Sep</div><div data-month="10">Oct</div>
              <div data-month="11">Nov</div><div data-month="12">Dec</div>
            </div>
            <div class="divider"></div>
            <div class="years"></div>
          </div>
        </div>
    `
        : ""
    }

    ${
      isprojects
        ? `
        <label>Project Name</label>
        <textarea class="title-input" required></textarea>

        <label>Project URL</label>
        <input type="url" class="link-input" placeholder="https://example.com">
    `
        : ""
    }

    <label>Description</label>
    <textarea class="description-input"></textarea>

    <button type="button" class="save-entry">Save</button>
`;

  $(form).hide();
  container.appendChild(form);
  $(form).slideDown(250);

  form.querySelectorAll(".date-picker").forEach((dp) => initDatePicker(dp));
  populateEditDropdown(form, target);
});

/* EDIT DROPDOWN*/
function populateEditDropdown(form, type) {
  const select = form.querySelector(".edit-entry-select");
  if (!select) return;

  select.innerHTML = `<option value="">-- Select existing ${type} --</option>`;

  (profileData[type] || []).forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.title || `Entry ${index + 1}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const index = select.value;
    if (index === "") {
      form.querySelector(".title-input").value = "";
      form.querySelector(".institution-input").value = "";
      form.querySelector(".description-input").value = "";
      form.querySelector(".start-date").value = "";
      form.querySelector(".end-date").value = "";
      return;
    }

    const entry = profileData[type][index];
    if (!entry) return;

    form.querySelector(".title-input").value = entry.title || "";
    form.querySelector(".institution-input").value = entry.institution || "";
    form.querySelector(".description-input").value = entry.description || "";
    form.querySelector(".start-date").value = entry.start_date || "";
    form.querySelector(".end-date").value = entry.end_date || "";
  });
}

function populateAllDropdowns() {
  document.querySelectorAll(".entry-form, .course-form").forEach((form) => {
    const select = form.querySelector(".edit-entry-select");
    if (!select) return;

    const parent = form.parentElement;
    let type = "courses";
    if (parent.classList.contains("experience-forms-container"))
      type = "experience";
    else if (parent.classList.contains("education-forms-container"))
      type = "education";
    else if (parent.classList.contains("projects-forms-container"))
      type = "projects";

    select.innerHTML = `<option value="">-- Select existing ${type} --</option>`;

    (profileData[type] || []).forEach((item, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = item.title || `Entry ${index + 1}`;
      select.appendChild(opt);
    });
  });
}

/* SAVE ENTRY */
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("save-entry")) return;

  const form = e.target.closest(".entry-form, .course-form");
  if (!form) return;

  const titleInput = form.querySelector(".title-input");

  if (titleInput && !titleInput.value.trim()) {
    titleInput.reportValidity();
    return;
  }

  const container = form.parentElement;

  let data;
  let listRef;

  if (container.classList.contains("courses-forms-container")) {
    listRef = coursesList;
  } else if (container.classList.contains("experience-forms-container")) {
    listRef = experienceList;
  } else if (container.classList.contains("education-forms-container")) {
    listRef = educationList;
  } else if (container.classList.contains("projects-forms-container")) {
    listRef = projectsList;
  } else {
    const acc = container.closest(".accordion-item");
    const headerText = acc
      ? acc.querySelector(".accordion-header").textContent.trim().toLowerCase()
      : "";
    if (headerText.includes("course")) listRef = coursesList;
    else if (headerText.includes("experience")) listRef = experienceList;
    else if (headerText.includes("education")) listRef = educationList;
    else listRef = projectsList;
  }

  const isProjects = container.classList.contains("projects-forms-container");

  if (isProjects) {
    data = {
      title: form.querySelector(".title-input").value.trim(),
      link: form.querySelector(".link-input").value.trim(),
      description: form.querySelector(".description-input").value.trim(),
    };
  } else {
    data = {
      title: form.querySelector(".title-input").value.trim(),
      institution: form.querySelector(".institution-input").value.trim(),
      start_date: form.querySelector(".start-date").value,
      end_date: form.querySelector(".end-date").value,
      description: form.querySelector(".description-input").value.trim(),
    };
  }

  const editSelect = form.querySelector(".edit-entry-select");
  if (editSelect && editSelect.value !== "") {
    listRef[Number(editSelect.value)] = data;
  } else {
    listRef.push(data);
  }

  populateAllDropdowns();
  renderProfileAccordion();
  updateSectionVisibility();

  saveAllDataToBackend();

  $(form).slideUp(250, () => form.remove());
  alert("Saved successfully!");
});

/*DELETE*/
document.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".delete-entry-btn");
  if (!delBtn) return;

  const form = delBtn.closest(".entry-form, .course-form, .skill-block");
  if (!form) return;

  const select = form.querySelector(".edit-entry-select, .edit-skill-select");
  if (!select) {
    alert("No selectable entry found.");
    return;
  }

  const indexStr = select.value;
  if (indexStr === "") {
    alert("Please select an entry to delete.");
    return;
  }

  const index = Number(indexStr);
  if (isNaN(index)) {
    alert("Invalid selection.");
    return;
  }

  const container = form.parentElement;
  let listRef;
  let isSkill = false;

  if (container.classList.contains("courses-forms-container"))
    listRef = coursesList;
  else if (container.classList.contains("experience-forms-container"))
    listRef = experienceList;
  else if (container.classList.contains("education-forms-container"))
    listRef = educationList;
  else if (container.classList.contains("projects-forms-container"))
    listRef = projectsList;
  else if (container.classList.contains("skills-container")) {
    listRef = skillsList;
    isSkill = true;
  } else listRef = coursesList;

  if (index < 0 || index >= listRef.length) {
    alert("Selected entry no longer exists.");
    populateAllDropdowns();
    if (isSkill) populateSkillDropdown(form);
    return;
  }

  listRef.splice(index, 1);

  if (isSkill) {
    renderSkills();
    populateSkillDropdown(form);
  } else {
    populateAllDropdowns();
    renderProfileAccordion();
  }

  updateSectionVisibility();
  saveAllDataToBackend();

  $(form).slideUp(200, () => form.remove());
  alert("Entry deleted.");
});

/*PROFILE DISPLAY*/
function renderProfileAccordionSection(
  containerSelector,
  dataList,
  sectionType,
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";

  let isProjects = sectionType === "projects";
  if (!sectionType) {
    isProjects =
      containerSelector.includes("project") ||
      container.id.includes("project") ||
      container.classList.contains("projects-container");
  }

  dataList.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("profile-accordion-item");

    const header = document.createElement("div");
    header.classList.add("profile-accordion-header");

    header.innerHTML = `
      <span>${item.title || `Entry ${idx + 1}`}</span>
      <span class="arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    `;

    const body = document.createElement("div");
    body.classList.add("profile-accordion-body");
    body.innerHTML = `
      ${
        !isProjects
          ? `
        <p><strong>Institution:</strong> ${item.institution || "-"}</p>
        <p><strong>Description:</strong> ${item.description || "-"}</p>
        <p><strong>Start:</strong> ${item.start_date || "-"}</p>
        <p><strong>End:</strong> ${
              item.end_date === "Present"
                ? `<span class="present-label">Present</span>`
                : item.end_date || "-"
            }</p>
      `
          : ""
      }
      ${
        isProjects
          ? `
        <p><strong>URL:</strong> ${
          item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.link}</a>`
            : "-"
        }</p>
        <p><strong>Description:</strong> ${item.description || "-"}</p>
      `
          : ""
      }
    `;

    header.addEventListener("click", () => {
      container.querySelectorAll(".profile-accordion-body").forEach((b) => {
        if (b !== body) {
          b.classList.remove("open");
          if (b.previousElementSibling) {
            b.previousElementSibling.classList.remove("active");
          }
        }
      });
      header.classList.toggle("active");
      body.classList.toggle("open");
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);
    container.appendChild(wrapper);
  });
}

function renderProfileAccordion() {
  renderProfileAccordionSection(
    ".profile-experience-container",
    experienceList,
  );
  renderProfileAccordionSection(".profile-education-container", educationList);
  renderProfileAccordionSection(".profile-courses-container", coursesList);
  renderProfileAccordionSection(".profile-projects-container", projectsList);
}


const type = wrapper.dataset.type; 
const startInput = document.querySelector(".start-date");

/* DATE DROPDOWN*/
function initDatePicker(wrapper) {
  const input = wrapper.querySelector(".dateInput");
  const dropdown = wrapper.querySelector(".prof-date-dropdown");
  const dateType = wrapper.getAttribute('date-type'); 
  
  if (!input || !dropdown) return;
  dropdown.style.display = "none";

  const monthsBox = wrapper.querySelector(".months");
  const yearsBox = wrapper.querySelector(".years");

  const today = new Date('2026-02-14');
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; 

  if (!yearsBox.dataset.loaded) {
    if (dateType === 'end') {
      const presentDiv = document.createElement("div");
      presentDiv.textContent = "Pre";
      presentDiv.dataset.present = "true";
      presentDiv.className = "present-option";
      presentDiv.style.cssText = "padding: 12px 8px; font-weight: bold; cursor: pointer; border-bottom: 1px solid #eee;";
      yearsBox.appendChild(presentDiv);
    }
    
    for (let y = currentYear + 10; y >= 1980; y--) {
      const div = document.createElement("div");
      div.textContent = y;
      div.dataset.year = y;
      div.className = "date-option";
      yearsBox.appendChild(div);
    }
    
    yearsBox.dataset.loaded = "true";
  }

  let selectedMonth = null;
  let selectedYear = null;
  let isPresentSelected = false;

  // hide all months
  if (dateType === 'start') {
    const allMonthOptions = monthsBox.querySelectorAll('div[data-month]');
    allMonthOptions.forEach(monthOpt => {
      monthOpt.style.display = 'none';
    });
  }

  function updateAvailableDates(selectedYearParam = null) {
    const allMonthOptions = monthsBox.querySelectorAll('div[data-month]');
    const allYearOptions = yearsBox.querySelectorAll('.date-option');
    const yearToCheck = selectedYearParam || selectedYear;

    if (dateType === 'start') {
      allYearOptions.forEach(option => {
        const year = parseInt(option.dataset.year);
        option.style.display = (year > currentYear) ? 'none' : 'block';
      });
      
      if (selectedYear) {
        allMonthOptions.forEach(monthOpt => {
          monthOpt.style.display = 'block';
        });
        
        if (yearToCheck === currentYear) {
          allMonthOptions.forEach(monthOpt => {
            const month = parseInt(monthOpt.dataset.month);
            monthOpt.style.display = (month <= currentMonth) ? 'block' : 'none';
          });
        }
      }
    }
    
    if (dateType === 'end') {
      const startInput = document.querySelector('.date-picker[date-type="start"] .dateInput');
      if (!startInput?.value || startInput.value.includes('YYYY')) return;
      
      const [startMonthStr, startYearStr] = startInput.value.split('/');
      const startMonthNum = parseInt(startMonthStr);
      const startYearNum = parseInt(startYearStr);
      
      // Hide years before start year
      allYearOptions.forEach(option => {
        const year = parseInt(option.dataset.year);
        option.style.display = (year >= startYearNum) ? 'block' : 'none';
      });
      
      // Hide months before start month for SAME YEAR
      allMonthOptions.forEach(monthOpt => {
        const month = parseInt(monthOpt.dataset.month);
        
        if (yearToCheck === startYearNum) {
          monthOpt.style.display = (month >= startMonthNum) ? 'block' : 'none';
        } else {
          monthOpt.style.display = 'block';
        }
      });
    }
  }

  input.addEventListener("click", (e) => {
    updateAvailableDates();
    dropdown.style.display = dropdown.style.display === "grid" ? "none" : "grid";
    e.stopPropagation();
  });


  if (dateType === 'start') {
    input.addEventListener('change', () => {
      const endPicker = document.querySelector('.date-picker[date-type="end"]');
      if (endPicker) {
        const endYearsBox = endPicker.querySelector('.years');
        endYearsBox.dataset.loaded = 'false';
        initDatePicker(endPicker);
      }
    });
  }

  monthsBox.addEventListener("click", (e) => {
    if (!e.target.dataset.month || e.target.style.display === 'none') return;
    
    if (dateType === 'start' && !selectedYear) return;
    
    const month = parseInt(e.target.dataset.month);
    monthsBox.querySelectorAll("div").forEach((m) => m.classList.remove("active"));
    e.target.classList.add("active");
    selectedMonth = month;
    isPresentSelected = false;
    updateInput();
  });

  yearsBox.addEventListener("click", (e) => {
    if (e.target.dataset.present) {
      if (dateType !== 'end') return;
      yearsBox.querySelectorAll("div").forEach((y) => y.classList.remove("active"));
      e.target.classList.add("active");
      selectedMonth = null;
      selectedYear = null;
      isPresentSelected = true;
      input.value = "Present";
      dropdown.style.display = "none";
      return;
    }
    
    if (!e.target.dataset.year || e.target.style.display === 'none') return;
    
    const year = parseInt(e.target.dataset.year);
    yearsBox.querySelectorAll("div").forEach((y) => y.classList.remove("active"));
    e.target.classList.add("active");
    selectedYear = year;
    isPresentSelected = false;
    
    updateAvailableDates(year); 
    updateInput();
  });

  function updateInput() {
    if (isPresentSelected) {
      input.value = "Present";
    } else if (selectedMonth) {
      input.value = `${String(selectedMonth).padStart(2, '0')}/${selectedYear || "YYYY"}`;
    }
    if ((selectedMonth && selectedYear) || isPresentSelected) {
      dropdown.style.display = "none";
    }
  }

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".date-picker").forEach((dp) => initDatePicker(dp));
  populateAllDropdowns?.();
  renderProfileAccordion?.();
});

// **NEW: Add "Present" functionality for End Date**
function addPresentOption() {
  const endInput = document.querySelector('.date-picker[date-type="end"] .dateInput');
  const endDropdown = document.querySelector('.date-picker[date-type="end"] .prof-date-dropdown');
  
  if (endInput && !endInput.dataset.presentAdded) {
    // Add Present button after the input
    const presentBtn = document.createElement('button');
    presentBtn.textContent = 'Present';
    presentBtn.className = 'present-btn';
    presentBtn.style.cssText = `
      margin-top: 5px; padding: 8px 16px; background: #007bff; 
      color: white; border: none; border-radius: 4px; cursor: pointer;
    `;
    
    presentBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      endInput.value = 'Present';
      endDropdown.style.display = 'none';
    });
    
    endInput.parentNode.insertBefore(presentBtn, endInput.nextSibling);
    endInput.dataset.presentAdded = 'true';
  }
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".date-picker").forEach((dp) => initDatePicker(dp));
  addPresentOption(); // Add Present button
  populateAllDropdowns?.(); // Your existing function
  renderProfileAccordion?.(); // Your existing function
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".date-picker").forEach((dp) => initDatePicker(dp));
  populateAllDropdowns();
  renderProfileAccordion();
});

/* SKILLS */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".accordion-content")) return;
  const content = e.target.closest(".accordion-content");
  const container = content.querySelector(".skills-container");
  if (!container) return;

  if (e.target.classList.contains("add-skill-btn")) {
    if (container.querySelector(".skill-block form")) {
      alert("Please finish the open skill form first.");
      return;
    }
    const form = document.createElement("div");
    form.classList.add("skill-block");

    form.innerHTML = `
      <div class="edit-row">
        <label>Edit Existing</label>
        <div class="edit-controls">
            <select class="edit-skill-select">
              <option value="">-- Select existing --</option>
            </select>
            <button type="button" class="delete-entry-btn" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-trash2-icon lucide-trash-2">
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                    <path d="M3 6h18"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </button>
        </div>
      </div>

      <label>Skill</label>
      <input type="text" class="form-input" placeholder="Enter Skill" />

      <label>Information</label>
      <div class="editor-area bullet-editor" contenteditable="true">
        <ul><li></li></ul>
      </div>

      <div class="skill-controls">
        <button type="button" class="save-skill-btn">Save</button>
      </div>
    `;
    container.appendChild(form);
    populateSkillDropdown(form);
    form.querySelector(".form-input")?.focus();
    return;
  }

  if (e.target.classList.contains("save-skill-btn")) {
    const block = e.target.closest(".skill-block");
    const name = block.querySelector(".form-input").value.trim();
    const info = block.querySelector(".bullet-editor").innerHTML.trim();

    if (!name) {
      alert("Skill name cannot be empty.");
      return;
    }

    const editSelect = block.querySelector(".edit-skill-select");
    const index = editSelect?.value;

    if (index !== "" && index !== undefined) {
      skillsList[Number(index)] = { skill: name, info };
    } else {
      skillsList.push({ skill: name, info });
    }

    renderSkills();
    populateSkillDropdown(block);
    updateSectionVisibility();
    saveAllDataToBackend();
    alert("Skill saved!");
    $(block).slideUp(250, () => block.remove());
    return;
  }
});

function populateEditDropdown(form, type) {
  const select = form.querySelector(".edit-entry-select");
  if (!select) return;

  select.innerHTML = `<option value="">-- Select existing ${type} --</option>`;
  (profileData[type] || []).forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.title || `Entry ${index + 1}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const entry = profileData[type][select.value] || {};

    const setVal = (selector, key) => {
      const input = form.querySelector(selector);
      if (input) input.value = entry[key] || "";
    };

    setVal(".title-input", "title");
    setVal(".description-input", "description");
    setVal(".institution-input", "institution");
    setVal(".start-date", "start_date");
    setVal(".end-date", "end_date");
    setVal(".link-input", "link");
  });
}

function escapeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function populateSkillDropdown(form) {
  const select = form.querySelector(".edit-skill-select");
  if (!select) return;

  select.innerHTML = `<option value="">-- Select existing --</option>`;

  skillsList.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.skill || `Skill ${index + 1}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const index = select.value;
    const nameInput = form.querySelector("input.form-input");
    const infoInput = form.querySelector(".bullet-editor");

    if (index === "") {
      if (nameInput) nameInput.value = "";
      if (infoInput) infoInput.innerHTML = "<ul><li></li></ul>";
      return;
    }

    const entry = skillsList[index];
    if (entry) {
      if (nameInput) nameInput.value = entry.skill || "";
      if (infoInput) infoInput.innerHTML = entry.info || "<ul><li></li></ul>";
    }
  });
}

function renderSkills() {
  const container = document.querySelector(".skills-list");
  if (!container) return;
  container.innerHTML = "";

  skillsList.forEach((s, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${escapeHtml(s.skill)}</strong>: ${s.info || "-"}`;
    container.appendChild(li);
  });
}
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
const Type = params.get("type");

//console.log(`Profile ID: ${userId}, Type: ${Type}`);
fetchProfileData();
function fetchProfileData() {
  if (userId && Type == "user") {
    get_user_data();
  } else if (userId && Type == "company") {
    get_company_data();
  } else {
    document.body.innerHTML = "<h2>Invalid profile URL</h2>";
  }
}

function get_user_data() {
  fetch(`../php/profile_user.php?id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.body.innerHTML = `<h2>${data.error}</h2>`;
      } else {
        if (data.Image == "profile.jpeg") {
          document.querySelector(".profile-photo").src =
            `../ImageStorage/profile.jpeg`;
          document.querySelector(".profile-photo2").src =
            `../ImageStorage/profile.jpeg`;
        } else {
          document.querySelector(".profile-photo").src =
            `../ImageStorage/users/${userId}/${data.Image}`;
          document.querySelector(".profile-photo2").src =
            `../ImageStorage/users/${userId}/${data.Image}`;
        }

        let cvCard = document.getElementById("cvCard");
        if (data.cv == null) {
          cvCard.style.display = "none";
        } else {
          cvCard.href = `/CVStorage/${userId}/${data.cv}`;
          document.querySelector(".file-display-text").innerHTML =
            `<span style="color: var(--secondary-color)">Update CV:</span> ${data.cv}`;
        }

        document.querySelector(".first-name").textContent = data.First_Name;
        document.querySelector(".last-name").textContent = data.Last_Name;
        document.querySelector(".profile-section .headline").textContent =
          data.Title || "";
        document.querySelector(".profile-section .Bio p").textContent =
          data.Bio || "";

        const fInput = document.getElementById("first-name");
        const lInput = document.getElementById("last-name");
        const hInput = document.getElementById("profile-headline");
        const bInput = document.getElementById("profile-bio");

        if (fInput) fInput.value = data.First_Name || "";
        if (lInput) lInput.value = data.Last_Name || "";
        if (hInput) hInput.value = data.Title || "";
        if (bInput) bInput.value = data.Bio || "";

        if (data.experience)
          experienceList.splice(0, experienceList.length, ...data.experience);
        if (data.education)
          educationList.splice(0, educationList.length, ...data.education);
        if (data.courses)
          coursesList.splice(0, coursesList.length, ...data.courses);
        if (data.projects)
          projectsList.splice(0, projectsList.length, ...data.projects);
        if (data.skills)
          skillsList.splice(0, skillsList.length, ...data.skills);

        renderProfileAccordion();
        renderSkills();
        populateAllDropdowns();
        updateSectionVisibility();

        if (data.is_owner === true) {
          document.getElementById("profile-edit").style.display = "block";
        } else {
          document.getElementById("profile-edit").style.display = "none";
          const p1 = document.querySelector(".profile-photo");
          const p2 = document.querySelector(".profile-photo2");
          if (p1) {
            p1.style.cursor = "default";
            p1.style.pointerEvents = "none";
          }
          if (p2) {
            p2.style.cursor = "default";
            p2.style.pointerEvents = "none";
          }
        }
      }
    })
    .catch((err) => {
      document.body.innerHTML = `<h2>Error loading profile</h2>`;
      console.error(err);
    });
}

function get_company_data() {
  fetch(`../php/profile_company.php?id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        document.body.innerHTML = `<h2>${data.error}</h2>`;
      } else {
        showCompanyInfo(data);
        if (data.image == "company.png") {
          document.querySelector(".profile-photo").src =
            `../ImageStorage/company.png`;
          document.querySelector(".profile-photo2").src =
            `../ImageStorage/company.png`;
        } else {
          document.querySelector(".profile-photo").src =
            `../ImageStorage/companies/${userId}/${data.image}`;
          document.querySelector(".profile-photo2").src =
            `../ImageStorage/companies/${userId}/${data.image}`;
        }

        if (data.is_owner === true) {
          document.getElementById("profile-edit").style.display = "block";
          editCompanyInfo(data);
        } else {
          document.getElementById("profile-edit").style.display = "none";
          document.querySelector(".profile-photo").style.cursor = "default";
          document.querySelector(".profile-photo2").style.cursor = "default";
          document.querySelector(".profile-photo").style.pointerEvents = "none";
          document.querySelector(".profile-photo2").style.pointerEvents =
            "none";
        }

        //console.log(data);
      }
    })
    .catch((err) => {
      document.body.innerHTML = `<h2>Error loading profile</h2>`;
      console.error(err);
    });
}

function showCompanyInfo(companyData) {
  document.querySelector(".profile-section").innerHTML = `
    <div class="name">${companyData.company_name}</div>
    <div class="headline">${companyData.company_email}</div>
    <div class="about">
      <h2>About Us</h2>
      <p>${companyData.description || ""}</p>
    </div>

    <div class"phone-number">
      <h2>Phone Number</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:10px;">
        <svg style="width:24px; height:24px; color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
        <a href="tel:${companyData.phone_number || ""}">${
          companyData.phone_number || ""
        }</a>
      </div>
    </div>
    
    <div class="website">
      <h2>Website</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:10px;">
      <svg style="width:24px; height:24px; color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>  
      <a href="${companyData.company_url || "#"}" target="_blank">${
        companyData.company_name || ""
      }</a>
      </div>
    </div>
    
    <div class="location">
      <h2>Location</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:2px;">
      <p>${companyData.country || ""},</p>
      <p>${companyData.city || ""},</p>
      <p>${companyData.state || ""},</p>
      <p>${companyData.street_address || ""},</p>
      <p>${companyData.zip_code || ""}</p>
      </div>
    </div>
  `;
}

function editCompanyInfo(companyData) {
  document.querySelector(".edit-panel").innerHTML = `
  
    <a href="#" class="close-btn">&times;</a>
      <h2>Edit Company Profile</h2>

      <form class="edit-form">
        <div class="accordion">
          <div class="accordion-item">
            <div class="accordion-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-id-card-icon lucide-id-card"
              >
                <path d="M16 10h2" />
                <path d="M16 14h2" />
                <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                <circle cx="9" cy="11" r="2" />
                <rect x="2" y="5" width="20" height="14" rx="2" />
              </svg>
              Profile 
              <span class="arrow"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                >
                  <path
                    d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"
                  />
                </svg>
              </span>
            </div>
            <div class="accordion-content">
              <div class="input-group">
                <label for="profile-name">Company Name</label>
                <input
                  type="text"
                  id="company-name"
                  class="form-input"
                  placeholder="Company Name"
                />
              </div>
              <div class="input-group">
                <label for="profile-bio">About Us</label>
                <textarea
                  id="profile-About-us"
                  class="form-input"
                ></textarea>
              </div>

              <div class="input-group">
                <label for="profile-name">phone number</label>
                <input
                  type="tel"
                  id="Company-number"
                  class="form-input"
                  placeholder="Company Number"
                />
              </div> 
              <div class="input-group">
                <label for="profile-headline">Website</label>
                <input
                  type="text"
                  id="CompanyURL"
                  class="form-input"
                />
              </div>
              
              <div class="input-group">
                <label for="profile-headline">Country</label>
                <input
                  type="text"
                  id="Company-country"
                  class="form-input"
                />
              </div>    
              <div class="input-group">
                <label for="profile-headline">City</label>
                <input
                  type="text"
                  id="companyCity"
                  class="form-input"
                />
              </div>
              <div class="input-group">
                <label for="profile-headline">State</label>
                <input
                  type="text"
                  id="companyState"
                  class="form-input"
                />
              </div>
              <div class="input-group">
                <label for="profile-headline"> Street Address</label>
                <input
                  type="text"
                  id="companyStreetAddress"
                  class="form-input"
                />
              </div>
              <div class="input-group">
                <label for="profile-headline">Zip-Code</label>
                <input
                  type="text"
                  id="companyZipCode"
                  class="form-input"
                />
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save Profile</button>
            <a href="#" class="cancel-btn">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  `;

  const accordionheaders = document.querySelectorAll(".accordion-header");
  const accordioncontents = document.querySelectorAll(".accordion-content");

  accordionheaders.forEach((header) => {
    header.addEventListener("click", () => {
      const accordionitem = header.parentElement;
      const accordioncontent =
        accordionitem.querySelector(".accordion-content");

      accordioncontents.forEach((content) => {
        if (content !== accordioncontent) {
          content.classList.remove("active");
          content.style.maxHeight = "0px";
        }
      });

      accordioncontent.classList.toggle("active");
      header.classList.toggle("active");
      accordioncontent.style.maxHeight = accordioncontent.classList.contains(
        "active",
      )
        ? accordioncontent.scrollHeight + "10px"
        : "0px";
    });
  });

  document.getElementById("company-name").value =
    companyData.company_name || "";
  document.getElementById("profile-About-us").value =
    companyData.description || "";
  document.getElementById("Company-number").value =
    companyData.phone_number || "";
  document.getElementById("CompanyURL").value = companyData.company_url || "";
  document.getElementById("Company-country").value = companyData.country || "";
  document.getElementById("companyState").value = companyData.state || "";
  document.getElementById("companyCity").value = companyData.city || "";
  document.getElementById("companyStreetAddress").value =
    companyData.street_address || "";
  document.getElementById("companyZipCode").value = companyData.zip_code || "";
}

function updateSectionVisibility() {
  // Experience
  const experienceSection = document.querySelector(".profile-experience");
  const editExperience = document.getElementById("experience-accordion");
  const experienceContainer = document.querySelector(
    ".profile-experience-container",
  );

  if (experienceContainer && experienceSection) {
    if (experienceContainer.children.length > 0) {
      experienceSection.style.display = "block";
      if (editExperience) editExperience.classList.add("active");
    } else {
      experienceSection.style.display = "none";
      if (editExperience) editExperience.classList.remove("active");
    }
  }

  // Education
  const educationSection = document.querySelector(".profile-education");
  const editEducation = document.getElementById("education-accordion");
  const educationContainer = document.querySelector(
    ".profile-education-container",
  );

  if (educationContainer && educationSection) {
    if (educationContainer.children.length > 0) {
      educationSection.style.display = "block";
      if (editEducation) editEducation.classList.add("active");
    } else {
      educationSection.style.display = "none";
      if (editEducation) editEducation.classList.remove("active");
    }
  }
  // Courses
  const coursesSection = document.querySelector(".profile-courses");
  const editCourses = document.getElementById("course-accordion");
  const coursesContainer = document.querySelector(".profile-courses-container");
  if (coursesContainer.children.length > 0) {
    coursesSection.style.display = "block";
    editCourses.classList.add("active");
  } else {
    coursesSection.style.display = "none";
    editCourses.classList.remove("active");
  }
  // Projects
  const projectsSection = document.querySelector(".profile-projects");
  const editProjects = document.getElementById("projects-accordion");
  const projectsContainer = document.querySelector(
    ".profile-projects-container",
  );
  if (projectsContainer.children.length > 0) {
    projectsSection.style.display = "block";
    editProjects.classList.add("active");
  } else {
    projectsSection.style.display = "none";
    editProjects.classList.remove("active");
  }
  // Skills
  const skillsSection = document.querySelector(".skills-section");
  const editSkills = document.getElementById("skills-accordion");
  const skillsList = document.querySelector(".skills-list");
  if (skillsList.children.length > 0) {
    skillsSection.style.display = "block";
    editSkills.classList.add("active");
  } else {
    skillsSection.style.display = "none";
    editSkills.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", updateSectionVisibility);
document.getElementById("profile-edit").addEventListener("click", openModal);

let selectedImageFile = null;
function uploadImageToServer(file) {
  const formData = new FormData();
  formData.append("profile_image", file);

  fetch("../../php/upload-profile-image.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.querySelector(".profile-photo").src = data.image_url;
        document.querySelector(".profile-photo2").src = data.image_url;
        document.querySelector(".profile-nav-img").src = data.image_url;
        document.querySelector(".profile-dropdown-img").src = data.image_url;
      } else {
        alert(data.message || "Error uploading image");
      }
    })
    .catch((err) => console.error(err));
}

function openModal() {
  document.body.classList.add("edit-open");
}

const backdrop = document.getElementById("blurred-background");
if (backdrop) backdrop.addEventListener("click", closeModal);
function closeModal() {
  document.body.classList.remove("edit-open");
  if (selectedImageFile) {
    document.querySelector(".profile-photo2").src = "";
    uploadImageToServer(selectedImageFile);
    fetchProfileData();
    selectedImageFile = null;
  }
}

document.getElementById("view-photo").addEventListener("click", uploadPhoto);
function uploadPhoto() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelector(".profile-photo2").src = e.target.result;
      };
      reader.readAsDataURL(file);
      selectedImageFile = file;
    }
  };
}

function uploadCVToServer(file) {
  const formData = new FormData();
  formData.append("cv_file", file);
  fetch("../../php/upload_cv.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("CV uploaded successfully!");
      } else {
        alert(data.message || "Error uploading CV");
      }
    })
    .catch((err) => console.error(err));
}

let cvFile = null;
document
  .getElementById("cv-file-input")
  .addEventListener("change", function () {
    const file = this.files[0];
    document.querySelector(".file-display-text").innerHTML = `${file.name}`;
    cvFile = file;
  });

/* Profile Save */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".save-btn");
  if (!btn) return;

  e.preventDefault();
  if (Type === "company") {
    const companyPayload = {
      company_name: document.getElementById("company-name")?.value.trim(),
      description: document.getElementById("profile-About-us")?.value.trim(),
      phone_number: document.getElementById("Company-number")?.value.trim(),
      company_url: document.getElementById("CompanyURL")?.value.trim(),
      country: document.getElementById("Company-country")?.value.trim(),
      city: document.getElementById("companyCity")?.value.trim(),
      state: document.getElementById("companyState")?.value.trim(),
      street_address: document
        .getElementById("companyStreetAddress")
        ?.value.trim(),
      zip_code: document.getElementById("companyZipCode")?.value.trim(),
      company_email: document.querySelector(".profile-section .headline")
        ?.textContent,
    };

    showCompanyInfo(companyPayload);

    fetch("../php/profile_company.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyPayload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Company profile saved!");
          closeModal();
        } else {
          alert("Error: " + (data.error || "Could not save"));
        }
      })
      .catch((err) => console.error("Save error:", err));
  } else if (Type === "user") {
    const fInput = document.getElementById("first-name");
    const lInput = document.getElementById("last-name");
    const hInput = document.getElementById("profile-headline");
    const bInput = document.getElementById("profile-bio");

    const fname = fInput ? fInput.value.trim() : "";
    const lname = lInput ? lInput.value.trim() : "";
    const title = hInput ? hInput.value.trim() : "";
    const bio = bInput ? bInput.value.trim() : "";

    const fDisplay = document.querySelector(".first-name");
    const lDisplay = document.querySelector(".last-name");
    const hDisplay = document.querySelector(".profile-section .headline");
    const bDisplay = document.querySelector(".profile-section .Bio p");

    if (fDisplay) fDisplay.textContent = fname;
    if (lDisplay) lDisplay.textContent = lname;
    if (hDisplay) hDisplay.textContent = title;
    if (bDisplay) bDisplay.textContent = bio;

    const payload = {
      fname: fname,
      lname: lname,
      title: title,
      bio: bio,
      experience: experienceList,
      education: educationList,
      courses: coursesList,
      projects: projectsList,
      skills: skillsList,
    };

    fetch("../php/profile_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Profile saved successfully!");
          document.body.classList.remove("edit-open");
        } else {
          console.error(data);
          alert("Error saving profile.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("An error occurred while saving.");
      });

    if (cvFile) {
      uploadCVToServer(cvFile);
    }
  }
});
