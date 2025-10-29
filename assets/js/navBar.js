const navbar = document.querySelector(".nav-bar");
const SCROLL_THRESHOLD = 50;

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  },
  { passive: true }
);
