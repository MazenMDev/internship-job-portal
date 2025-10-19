const toggleLink = document.querySelector(".edit-btn");
const  select = document.querySelector(".edit-btn");
const allHiddenDivs = document.querySelectorAll("select");

toggleLink.addEventListener("click", (event) => {
  event.preventDefault();
  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});
select.addEventListener("click", (event) => {
  event.preventDefault();

});
