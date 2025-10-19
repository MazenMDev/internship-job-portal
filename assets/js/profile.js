const toggleLink = document.querySelector(".edit-btn");
const allHiddenDivs = document.querySelectorAll(".edit");

toggleLink.addEventListener("click", (event) => {
  event.preventDefault();
  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});
