document.getElementById("addSkill").addEventListener("click", function (e) {
  e.preventDefault();

  const addBtn = document.getElementById("addSkill");
  const container = document.querySelector(".skills-div");

  const skillDiv = document.createElement("div");
  skillDiv.className = "skill";
  skillDiv.contentEditable = "true"; // make it editable when user add ti
  skillDiv.setAttribute("data-editing", "true");
  skillDiv.textContent = "";

  container.insertBefore(skillDiv, addBtn);
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
