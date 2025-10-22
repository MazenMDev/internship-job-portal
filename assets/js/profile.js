const toggleLink = document.querySelector(".edit-btn");
const allHiddenDivs = document.querySelectorAll(".edit");

// 1. Use querySelectorAll to get a LIST of all editable texts
const textsToEdit = document.querySelectorAll(".editedtext");

toggleLink.addEventListener("click", (event) => {
  event.preventDefault();

  // 2. Loop through every element in the list
  textsToEdit.forEach((textElement) => {
    // Get the current state (true or false)
    const isEditable = textElement.getAttribute("contenteditable") === "true";

    // Set the attribute to the opposite of its current state
    textElement.setAttribute("contenteditable", !isEditable);
  });

  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});


