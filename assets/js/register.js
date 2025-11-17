let eyeIcon1 = document.getElementById("eyeIcon1");
let eyeIcon2 = document.getElementById("eyeIcon2");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirm");
let toggle1 = false;
let toggle2 = false;

eyeIcon1.addEventListener("click", () => {
  toggle1 = !toggle1;
  if (toggle1) {
    password.type = "text";
    eyeIcon1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
  } else {
    password.type = "password";
    eyeIcon1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
});

eyeIcon2.addEventListener("click", () => {
  toggle2 = !toggle2;
  if (toggle2) {
    confirmPassword.type = "text";
    eyeIcon2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
  } else {
    confirmPassword.type = "password";
    eyeIcon2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
});

password.addEventListener("input", () => {
  if (password.value.length >= 30) {
    password.value = password.value.slice(0, 30);
  }

  if (password.value.length > 0) {
    eyeIcon1.style.display = "inline";
  } else {
    eyeIcon1.classList.add("hideEyeIcon");
    setTimeout(() => {
      eyeIcon1.classList.remove("hideEyeIcon");
      eyeIcon1.style.display = "none";
      password.type = "password";
      toggle1 = false;
      eyeIcon1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    }, 200);
  }
});

confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value.length >= 30) {
    confirmPassword.value = confirmPassword.value.slice(0, 30);
  }
  if (confirmPassword.value.length > 0) {
    eyeIcon2.style.display = "inline";
  } else {
    eyeIcon2.classList.add("hideEyeIcon");
    setTimeout(() => {
      eyeIcon2.classList.remove("hideEyeIcon");
      eyeIcon2.style.display = "none";
      confirmPassword.type = "password";
      toggle2 = false;
      eyeIcon2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    }, 200);
  }
});

const form = document.getElementById("form");
const errorMsg = document.getElementById("errorMsg");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let passwordVal = (password.value = password.value.trim());
  let confirmPasswordVal = (confirmPassword.value =
    confirmPassword.value.trim());

  // PASSWORD VALIDATIONS
  let numbers = /[0-9]/g;
  
  const f_name = document.getElementById("fname").value.trim();
  const l_name = document.getElementById("lname").value.trim();
  if (f_name.length === 0 || l_name.length === 0) {
    errorMsg.textContent = "First name and Last name cannot be empty.";
    return;
  }
  
  if (numbers.test(f_name) || numbers.test(l_name)) {
    errorMsg.textContent = "Names cannot contain numbers.";
    return;
  }
  let specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
  if (specialChars.test(f_name) || specialChars.test(l_name)) {
    errorMsg.textContent = "Names cannot contain special characters.";
    return;
  }
  
  if (passwordVal.length < 8) {
    errorMsg.textContent = "Password must be at least 8 characters long.";
    return;
  }
  //regular expression to check for lowercase letters
  let lowerCaseLetters = /[a-z]/g;
  if (!passwordVal.match(lowerCaseLetters)) {
    errorMsg.textContent =
      "Password must contain at least one lowercase letter.";
    return;
  }
  //regular expression to check for uppercase letters
  let upperCaseLetters = /[A-Z]/g;
  if (!passwordVal.match(upperCaseLetters)) {
    errorMsg.textContent =
      "Password must contain at least one uppercase letter.";
    return;
  }
  //regular expression to check for numbers
  if (!passwordVal.match(numbers)) {
    errorMsg.textContent = "Password must contain at least one number.";
    return;
  }

  let notAllowedChars = /[<>\/\\'"]/g;
  if (passwordVal.match(notAllowedChars)) {
    errorMsg.textContent = "Password contains invalid characters.";
    return;
  }

  for (let char of passwordVal) {
    if (char === " ") {
      errorMsg.textContent = "Password cannot contain spaces.";
      return;
    }
  }

  if (passwordVal !== confirmPasswordVal) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  errorMsg.textContent = "";

  const formData = new FormData(form);

  fetch("../php/register.php", {
    method: "POST",
    body: formData,
  }).then((res) => res.json()).then((data) => {
      if (data.status === "error") {
        errorMsg.style.color = "var(--error)";
        errorMsg.textContent = data.message;
      } else {
        errorMsg.style.color = "var(--success)";
        errorMsg.textContent = data.message;
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 1000);
      }
    })
    .catch(() => {
      errorMsg.textContent = "Something went wrong. Please try again.";
    });
});
