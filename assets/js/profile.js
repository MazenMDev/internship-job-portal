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
        }
      });

      accordioncontent.classList.toggle("active");
      accordioncontent.style.maxHeight = accordioncontent.classList.contains(
        "active"
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

      <label>Title</label>
      <textarea class="title-input"></textarea>

      <label>${isCourse ? "Institution" : " "}
      ${iseducation ? "School/University" : " "}
      ${isprojects ? "Project Name" : " "}
      ${isexperience ? "Company" : " "}
      
      </label>
      <textarea class="institution-input"></textarea>

      <div class="date-picker">
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

      <div class="date-picker">
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
    form.querySelector(".start-date").value = entry.start || "";
    form.querySelector(".end-date").value = entry.end || "";
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
  const container = form.parentElement;

  const data = {
    title: form.querySelector(".title-input").value.trim(),
    institution: form.querySelector(".institution-input").value.trim(),
    start: form.querySelector(".start-date").value,
    end: form.querySelector(".end-date").value,
    description: form.querySelector(".description-input").value.trim(),
  };

  let listRef;
  if (container.classList.contains("courses-forms-container"))
    listRef = coursesList;
  else if (container.classList.contains("experience-forms-container"))
    listRef = experienceList;
  else if (container.classList.contains("education-forms-container"))
    listRef = educationList;
  else if (container.classList.contains("projects-forms-container"))
    listRef = projectsList;
  else {
    const acc = container.closest(".accordion-item");
    const headerText = acc
      ? acc.querySelector(".accordion-header").textContent.trim().toLowerCase()
      : "";
    if (headerText.includes("course")) listRef = coursesList;
    else if (headerText.includes("experience")) listRef = experienceList;
    else if (headerText.includes("education")) listRef = educationList;
    else listRef = projectsList;
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

  $(form).slideUp(250, () => form.remove());
  alert("Saved successfully!");
});

/*DELETE*/
document.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".delete-entry-btn");
  if (!delBtn) return;

  const form = delBtn.closest(".entry-form, .course-form");
  if (!form) return;

  const select = form.querySelector(".edit-entry-select");
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
  if (container.classList.contains("courses-forms-container"))
    listRef = coursesList;
  else if (container.classList.contains("experience-forms-container"))
    listRef = experienceList;
  else if (container.classList.contains("education-forms-container"))
    listRef = educationList;
  else if (container.classList.contains("projects-forms-container"))
    listRef = projectsList;
  else listRef = coursesList;

  if (index < 0 || index >= listRef.length) {
    alert("Selected entry no longer exists.");
    populateAllDropdowns();
    return;
  }

  listRef.splice(index, 1); // delete entry
  populateAllDropdowns();
  renderProfileAccordion();
  updateSectionVisibility();
  $(form).slideUp(200, () => form.remove());
  alert("Entry deleted.");
});

/*PROFILE DISPLAY*/
function renderProfileAccordionSection(containerSelector, dataList) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";

  dataList.forEach((item, idx) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("profile-accordion-item");

    const header = document.createElement("div");
    header.classList.add("profile-accordion-header");
    header.textContent = item.title || `Entry ${idx + 1}`;

    const body = document.createElement("div");
    body.classList.add("profile-accordion-body");
    body.innerHTML = `
      <p><strong>Institution:</strong> ${item.institution || "-"}</p>
      <p><strong>Description:</strong> ${item.description || "-"}</p>
      <p><strong>Start:</strong> ${item.start || "-"}</p>
      <p><strong>End:</strong> ${item.end || "-"}</p>
    `;

    header.addEventListener("click", () => {
      container.querySelectorAll(".profile-accordion-body").forEach((b) => {
        if (b !== body) b.classList.remove("open");
      });
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
    experienceList
  );
  renderProfileAccordionSection(".profile-education-container", educationList);
  renderProfileAccordionSection(".profile-courses-container", coursesList);
  renderProfileAccordionSection(".profile-projects-container", projectsList);
}

/* DATE DROPDOWN*/
function initDatePicker(wrapper) {
  const input = wrapper.querySelector(".dateInput");
  const dropdown = wrapper.querySelector(".prof-date-dropdown");
  if (!input || !dropdown) return;
  dropdown.style.display = "none";

  const monthsBox = wrapper.querySelector(".months");
  const yearsBox = wrapper.querySelector(".years");

  if (!yearsBox.dataset.loaded) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1980; y--) {
      const div = document.createElement("div");
      div.textContent = y;
      div.dataset.year = y;
      yearsBox.appendChild(div);
    }
    yearsBox.dataset.loaded = "true";
  }

  let selectedMonth = null;
  let selectedYear = null;

  input.addEventListener("click", (e) => {
    dropdown.style.display =
      dropdown.style.display === "grid" ? "none" : "grid";
    e.stopPropagation();
  });

  monthsBox.addEventListener("click", (e) => {
    if (!e.target.dataset.month) return;
    monthsBox
      .querySelectorAll("div")
      .forEach((m) => m.classList.remove("active"));
    e.target.classList.add("active");
    selectedMonth = e.target.dataset.month;
    updateInput();
  });

  yearsBox.addEventListener("click", (e) => {
    if (!e.target.dataset.year) return;
    yearsBox
      .querySelectorAll("div")
      .forEach((y) => y.classList.remove("active"));
    e.target.classList.add("active");
    selectedYear = e.target.dataset.year;
    updateInput();
  });

  function updateInput() {
    if (selectedMonth)
      input.value = `${selectedMonth}/${selectedYear || "YYYY"}`;
    if (selectedMonth && selectedYear) dropdown.style.display = "none";
  }

  // close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".date-picker").forEach((dp) => initDatePicker(dp));
  populateAllDropdowns();
  renderProfileAccordion();
});

/* PROFILE*/
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".save-btn");
  if (!btn) return;

  e.preventDefault();

  const nameEl = document.getElementById("profile-name");
  const headlineEl = document.getElementById("profile-headline");
  const bioEl = document.getElementById("profile-bio");

  profileData.profile = {
    name: nameEl ? nameEl.value.trim() : "",
    headline: headlineEl ? headlineEl.value.trim() : "",
    bio: bioEl ? bioEl.value.trim() : "",
  };

  const nameContainer = document.querySelector(".name");
  const headlineContainer = document.querySelector(".headline");
  const bioContainer = document.querySelector(".Bio p");

  if (nameContainer)
    nameContainer.textContent = profileData.profile.name || "Profile name";
  if (headlineContainer)
    headlineContainer.textContent = profileData.profile.headline || "";
  if (bioContainer) bioContainer.textContent = profileData.profile.bio || "";

  profileData.skills = [];

  document.querySelectorAll(".accordion-item").forEach((item) => {
    const headerText =
      item
        .querySelector(".accordion-header")
        ?.textContent.trim()
        .toLowerCase() || "";
    if (headerText.includes("skills")) {
      const content = item.querySelector(".accordion-content");
      if (content) {
        const skillInput = content.querySelector(".form-input");
        const bulletEditor = content.querySelector(".bullet-editor");

        profileData.skills.push({
          skill: skillInput ? skillInput.value.trim() : "",
          info: bulletEditor ? bulletEditor.innerHTML.trim() : "",
        });
      }
    }
  });

  const skillsContainer = document.querySelector(".skills-list");
  if (skillsContainer) {
    skillsContainer.innerHTML = "";
    profileData.skills.forEach((s) => {
      if (!s.skill && !s.info) return;
      const li = document.createElement("li");
      li.innerHTML = `<strong>${escapeHtml(s.skill)}</strong>: ${s.info || "-"
        }`;
      skillsContainer.appendChild(li);
    });
  }

  console.log("Profile saved:", profileData.profile);
  console.log("Skills saved:", profileData.skills);
  console.log("All data:", profileData);
  alert("Profile & Skills Saved Successfully!");
});

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
            <select class="edit-entry-select">
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
        <button type="button" class="delete-skill-btn">Delete</button>
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
    alert("Skill saved!");
    $(block).slideUp(250, () => block.remove());
    return;
  }

  if (e.target.classList.contains("delete-skill-btn")) {
    const block = e.target.closest(".skill-block");
    const editSelect = block.querySelector(".edit-skill-select");
    const index = editSelect?.value;

    if (index !== "" && index !== undefined) {
      skillsList.splice(Number(index), 1);
      renderSkills();
    }
    $(block).slideUp(200, () => block.remove());
    return;
  }
});

function populateSkillDropdown(form) {
  const select = form.querySelector(".edit-skill-select");
  if (!select) return;

  select.innerHTML = `<option value="">-- Select existing skill --</option>`;
  skillsList.forEach((s, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = s.skill || `Skill ${idx + 1}`;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const index = select.value;
    if (index === "") {
      form.querySelector(".form-input").value = "";
      form.querySelector(".bullet-editor").innerHTML = "<ul><li></li></ul>";
      return;
    }
    const skillData = skillsList[index];
    form.querySelector(".form-input").value = skillData.skill || "";
    form.querySelector(".bullet-editor").innerHTML =
      skillData.info || "<ul><li></li></ul>";
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
/* PROFILE PHOTO UPLOAD*/
document.addEventListener("DOMContentLoaded", () => {
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
    loadProfileDataIntoForm();
    document.body.classList.add("edit-open");
  }
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
    // create a hidden file input to choose an image
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
});


const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
fetchProfileData();
function fetchProfileData() {
  if (userId) {
    fetch(`../php/profile.php?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          document.body.innerHTML = `<h2>${data.error}</h2>`;
        } else {
          if (data.Image == "profile.jpeg") {
            document.querySelector(
              ".profile-photo"
            ).src = `../ImageStorage/profile.jpeg`;
            document.querySelector(
              ".profile-photo2"
            ).src = `../ImageStorage/profile.jpeg`;
          } else {
            document.querySelector(
              ".profile-photo"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
            document.querySelector(
              ".profile-photo2"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
          }

          document.querySelector(
            ".profile-section .name"
          ).textContent = `${data.First_Name} ${data.Last_Name}`;

          if (data.Title) {
            document.querySelector(".profile-section .headline").textContent =
              data.Title;
          } else {
            document.querySelector(".profile-section .headline").textContent =
              "";
          }
          if (data.Bio) {
            document.querySelector(".profile-section .Bio p").textContent =
              data.Bio;
          } else {
            document.querySelector(".profile-section .Bio p").textContent =
              "";
          }

          if (data.is_owner === true) {
            document.getElementById("profile-edit").style.display = "block";
          } else {
            document.getElementById("profile-edit").style.display = "none";
            document.querySelector(".profile-photo").style.cursor = "default";
            document.querySelector(".profile-photo2").style.cursor = "default";
            document.querySelector(".profile-photo").style.pointerEvents = "none";
            document.querySelector(".profile-photo2").style.pointerEvents = "none";

          }
          if(data.is_company){
            fetch("../php/company-profile.php?id=" + userId)
            .then((res) => res.json())
            .then((companyData) => {
              showCompanyInfo(companyData , data);
              changeFormToCompanyProfile(companyData , data);
            })
            .catch((err) => {
              console.error(err);
            });
          }



        }
      })
      .catch((err) => {
        document.body.innerHTML = `<h2>Error loading profile</h2>`;
        console.error(err);
      });
  } else {
    //document.body.innerHTML = "<h2>Invalid profile URL</h2>";
  }
}

function showCompanyInfo(companyData){

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
        <a href="tel:${companyData.phone_number || ""}">${companyData.phone_number || ""}</a>
      </div>
    </div>
    
    <div class="website">
      <h2>Website</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:10px;">
      <svg style="width:24px; height:24px; color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>  
      <a href="${companyData.company_url || "#"}" target="_blank">${companyData.company_name || ""}</a>
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

function changeFormToCompanyProfile(companyData){
  document.querySelector(".editTitle").textContent = "Edit your Company profile";
  document.getElementById("formEdit").innerHTML = `
          <div class="inp" id="name-div">
            <label for="companyName">Company Name</label
            ><input class="holder" type="text" name="companyName" id="companyName" />
          </div>
        <div class="inp" id="desc-div">
          <label for="companyDesc">Description</label>
          <textarea class="holder" type="text" name="companyDesc" id="companyDesc"></textarea>
        </div>
        
        <div class="inp" id="phone-div">
          <label for="phone-number">Phone Number</label
          ><input class="holder" type="text" name="phone-number" id="phone-number" />
        </div>
        <div class="inp" id="website-div">
          <label for="website">Website URL</label
          ><input class="holder" type="text" name="website" id="website" />
        </div>
        <div class="grid">
          <div class="inp" id="country-div">
            <label for="companyCountry">Country</label
            ><input class="holder" type="text" name="companyCountry" id="companyCountry" />
          </div>
          <div class="inp" id="state-div">
            <label for="companyState">State</label
            ><input class="holder" type="text" name="companyState" id="companyState" />
          </div>
        </div>
        <div class="grid">
          <div class="inp" id="city-div">
            <label for="companyCity">City</label>
            <input class="holder" type="text" name="companyCity" id="companyCity" />
          </div>
          <div class="inp" id="street-div">
            <label for="companyStreetAddress">Street Address</label
            ><input class="holder" type="text" name="companyStreetAddress" id="companyStreetAddress" />
          </div>
        </div>
          <div class="inp" id="zip-div">
            <label for="companyZipCode">Zip Code</label
            ><input class="holder" type="text" name="companyZipCode" id="companyZipCode" />
          </div>
        
        
        
      <div class="inp">
          <input type="submit" value="Save changes" class="submit" />
        </div>
  `;
  document.getElementById("companyName").value = companyData.company_name || "";
  document.getElementById("companyDesc").value = companyData.description || "";
  document.getElementById("phone-number").value = companyData.phone_number || "";
  document.getElementById("website").value = companyData.company_url || "";
  document.getElementById("companyCountry").value = companyData.country || "";
  document.getElementById("companyState").value = companyData.state || "";
  document.getElementById("companyCity").value = companyData.city || "";
  document.getElementById("companyStreetAddress").value = companyData.street_address || "";
  document.getElementById("companyZipCode").value = companyData.zip_code || "";
} 

function updateSectionVisibility() {
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
    ".profile-projects-container"
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
