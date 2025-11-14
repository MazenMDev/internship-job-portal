document.getElementById("addExperience").addEventListener("click", function (e) {
  e.preventDefault();

  const addBtn = document.getElementById("addExperience");
  const container = document.querySelector(".experience-div");

  const expDiv = document.createElement("div");
  expDiv.className = "experience";
  expDiv.contentEditable = "true";
  expDiv.setAttribute("data-editing", "true");
  expDiv.textContent = "";

  container.insertBefore(expDiv, addBtn);
  expDiv.focus();

  function finishEditing() {
    expDiv.removeAttribute("data-editing");
    expDiv.contentEditable = "false";

    if (!expDiv.textContent.trim()) {
      expDiv.remove();
      return;
    }

    expDiv.textContent = expDiv.textContent.trim();
  }

  expDiv.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      finishEditing();
      expDiv.blur();
    } else if (ev.key === "Escape") {
      expDiv.remove();
    }
  });

  // If the user leaves the div then keep it in the form
  expDiv.addEventListener("blur", function () {
    if (expDiv.getAttribute("data-editing")) {
      finishEditing();
    }
  });

  // remove a skill when clcicked
  expDiv.addEventListener("click", function () {
    if (expDiv.contentEditable === "false") {
      expDiv.remove();
    }
  });
});
