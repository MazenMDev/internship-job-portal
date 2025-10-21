const toggleLink = document.querySelector(".edit-btn");
const allHiddenDivs = document.querySelectorAll(".edit");
const textToEdit = document.querySelector(".headline.editedtext");

toggleLink.addEventListener("click", (event) => {
  event.preventDefault();
  textToEdit.setAttribute(
    "contenteditable",
    textToEdit.getAttribute("contenteditable") !== "true"
  );
  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});

// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get all the elements we need
  const openBtn = document.getElementById("open-btn");
  const closeBtn = document.getElementById("close-btn");
  const backdrop = document.getElementById("blurred-background");

  // Function to open the modal
  function openModal() {
    document.body.classList.add("modal-open");
  }

  // Function to close the modal
  function closeModal() {
    document.body.classList.remove("modal-open");
  }

  // Add event listeners
  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  // Also close when clicking the backdrop
  backdrop.addEventListener("click", closeModal);
});
