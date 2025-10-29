const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

const eyeIcon = document.querySelector(".eyeIcon");
let toggle = false;

eyeIcon.addEventListener("click", () => {
  toggle = !toggle;
  if (toggle) {
    password.type = "text";
    eyeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
  } else {
    password.type = "password";
    eyeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
});

password.addEventListener("input", () => {
  if (password.value.length > 0) {
    eyeIcon.style.display = "inline";
  } else {
    eyeIcon.classList.add("hideEyeIcon");

    setTimeout(() => {
      eyeIcon.classList.remove("hideEyeIcon");
      eyeIcon.style.display = "none";
      password.type = "password";
      toggle = false;
      eyeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  
    }, 200);
  }
});


const errorMsg = document.getElementById("errorMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let emailVal = email.value = email.value.trim();
  let passwordVal = password.value = password.value.trim();

  if (emailVal === "" || passwordVal === "") {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }
});