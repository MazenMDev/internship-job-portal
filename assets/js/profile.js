// 1. Find the HTML elements and store them in variables

const toggleLink = document.querySelector(".edit-btn");

const allHiddenDivs = document.querySelectorAll(".edit");

// Add the 'click' event listener
// We add 'event' here so we can use it inside
toggleLink.addEventListener("click", (event) => {
  // --- THE JAVASCRIPT CHANGE ---
  // This stops the <a> tag's default behavior
  // (which is to navigate to the '#' and jump the page)
  event.preventDefault();
  // -----------------------------

  // This part is exactly the same as before
  allHiddenDivs.forEach((div) => {
    div.classList.toggle("edit");
  });
});
