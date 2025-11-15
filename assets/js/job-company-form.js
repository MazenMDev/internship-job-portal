import jobCategories from "./jobCategories.js";
const jobcat = document.getElementById("categoryDropdown");

for (let parent in jobCategories) {
  const parentOptgroup = document.createElement("optgroup");
  parentOptgroup.label = parent;
  parentOptgroup.classList.add("optgroup-category");
  for (let jobCategory of jobCategories[parent]) {
    const childoption = document.createElement("option");
    childoption.value = jobCategory;
    childoption.textContent = jobCategory;
    childoption.classList.add("option-category");
    parentOptgroup.appendChild(childoption);
  }
  jobcat.appendChild(parentOptgroup);
}

/*
<select> 
  <optgroup label="PARENT CATEGORY">
    <option value="CHILD CATEGORY">CHILD CATEGORY</option>
  </optgroup>
</select>
*/

document.getElementById("addSkill").addEventListener("click", function (e) {
  e.preventDefault();

  const container = document.querySelector(".skills-disp");

  const skillDiv = document.createElement("div");
  skillDiv.className = "skill";
  skillDiv.contentEditable = "true"; // make it editable when user add ti
  skillDiv.setAttribute("data-editing", "true");
  skillDiv.textContent = "";

  container.appendChild(skillDiv);
  skillDiv.focus();

  function finishEditing() {
    skillDiv.removeAttribute("data-editing");
    skillDiv.contentEditable = "false";

    //  remove it if user left it empty
    if (!skillDiv.textContent.trim()) {
      skillDiv.remove();
    }
    skillDiv.textContent = skillDiv.textContent.trim();
  }

  skillDiv.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      finishEditing();
      skillDiv.blur();
    } else if (ev.key === "Escape") {
      skillDiv.remove();
    }
  });

  // If the user leaves the div then keep it in the form
  skillDiv.addEventListener("blur", function () {
    if (skillDiv.getAttribute("data-editing")) {
      finishEditing();
    }
  });

  // remove a skill when clcicked
  skillDiv.addEventListener("click", function () {
    if (skillDiv.contentEditable === "false") {
      skillDiv.remove();
    }
  });
});







document.getElementById("addtag").addEventListener("click", function (e) {
  e.preventDefault();

  const container = document.querySelector(".tag-disp");

  const tagDiv = document.createElement("div"); // consistently lowercase
  tagDiv.className = "tag";
  tagDiv.contentEditable = "true";
  tagDiv.setAttribute("data-editing", "true");
  tagDiv.textContent = "";

  container.appendChild(tagDiv);
  tagDiv.focus();

  function finishEditing() {
    tagDiv.removeAttribute("data-editing");
    tagDiv.contentEditable = "false";

    if (!tagDiv.textContent.trim()) {
      tagDiv.remove();
    } else {
      tagDiv.textContent = tagDiv.textContent.trim();
    }
  }

  tagDiv.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      finishEditing();
      tagDiv.blur();
    } else if (ev.key === "Escape") {
      tagDiv.remove();
    }
  });

  tagDiv.addEventListener("blur", function () {
    if (tagDiv.getAttribute("data-editing")) {
      finishEditing();
    }
  });

  tagDiv.addEventListener("click", function () {
    if (tagDiv.contentEditable === "false") {
      tagDiv.remove();
    }
  });
});
