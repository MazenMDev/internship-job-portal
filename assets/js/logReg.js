function updateLabels(input, label, isActive) {
  const restSpan = label.querySelector(".label-rest");
  const spans = restSpan
    ? label.querySelectorAll("span:not(.label-rest)")
    : label.querySelectorAll("span");

  const active = isActive || input.value !== "";

  if (active) {
    spans.forEach((span) => {
      span.style.transform = "translateY(-35px)";
      span.style.color = "var(--primary-color)";
    });
    if (restSpan) {
      restSpan.style.opacity = "0";
      restSpan.style.transform = "translateY(-6px)";
      restSpan.style.transition =
        restSpan.style.transition ||
        "opacity 220ms ease, transform 280ms cubic-bezier(.22,.61,.36,1)";
    }
  } else {
    spans.forEach((span) => {
      span.style.transform = "translateY(0px)";
      span.style.color = "var(--text-muted)";
    });
    if (restSpan) {
      restSpan.style.opacity = "0.92";
      restSpan.style.transform = "translateY(0)";
      restSpan.style.transition =
        restSpan.style.transition ||
        "opacity 220ms ease, transform 280ms cubic-bezier(.22,.61,.36,1)";
    }
  }
}

// get the next sibling label for an input
function getLabelForInput(input) {
  return input.nextElementSibling;
}

// Update login form labels
function updateLoginLabels() {
  // Only target login box inputs
  const loginBoxEl = document.querySelector("#loginBox");
  if (!loginBoxEl) return;

  const inputs = loginBoxEl.querySelectorAll(
    "input[type='email'], input[type='password']"
  );
  inputs.forEach((input) => {
    const label = getLabelForInput(input);
    if (!label) return;
    const text = (label.textContent || "").trim();
    if (!text) return;

    label.innerHTML = text
      .split("")
      .map(
        (letter, idx) =>
          `<span style="display:inline-block; transition:transform 0.3s ease, color 0.3s ease; transition-delay:${
            idx * 50
          }ms">${letter === " " ? "&nbsp;" : letter}</span>`
      )
      .join("");

    if (String(input.value || "").trim() !== "") {
      updateLabels(input, label, true);
    }
    input.addEventListener("focus", () => updateLabels(input, label, true));
    input.addEventListener("blur", () => updateLabels(input, label, false));
    input.addEventListener("input", () => updateLabels(input, label, true));
  });
}

// Update register form labels
function updateRegLabels() {
  // Only target register box inputs
  const registerBoxEl = document.querySelector("#registerBox");
  if (!registerBoxEl) return;

  const inputs = registerBoxEl.querySelectorAll(
    "input[type='text'], input[type='email'], input[type='password']"
  );
  inputs.forEach((input) => {
    const label = getLabelForInput(input);
    if (!label) return;
    const full = (label.textContent || "").trim();
    if (!full) return;

    const [firstWord, restText = ""] = full.split(" ", 2);

    // Build first-word spans with delays
    const firstHTML = firstWord
      .split("")
      .map(
        (letter, idx) =>
          `<span style="display:inline-block; cursor: text; transition:transform 0.3s ease, color 0.3s ease; transition-delay:${
            idx * 50
          }ms">${letter === " " ? "&nbsp;" : letter}</span>`
      )
      .join("");

    const restHTML = restText
      ? `<span class="label-rest" style="display:inline-block; cursor: text; margin-left:4px; transition: opacity 220ms ease, transform 280ms cubic-bezier(.22,.61,.36,1);">${restText}</span>`
      : "";

    label.innerHTML = `${firstHTML}${restHTML}`;

    if (String(input.value || "").trim() !== "") {
      updateLabels(input, label, true);
    }
    input.addEventListener("focus", () => updateLabels(input, label, true));
    input.addEventListener("blur", () => updateLabels(input, label, false));
    input.addEventListener("input", () => updateLabels(input, label, true));
  });
}

updateLoginLabels();
updateRegLabels();

// update on load in case of autofill in load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll("input").forEach((input) => {
      const label = getLabelForInput(input);
      if (!label) return;
      if (String(input.value || "").trim() !== "") {
        updateLabels(input, label, true);
      }
    });
  }, 100);

  const loginPass = document.getElementById("logInPassword");
  const eyeIconLogin = document.querySelector("#loginBox .eyeIconLogin");

  let LogInToggle = false;

  eyeIconLogin.addEventListener("click", () => {
    LogInToggle = !LogInToggle;
    if (LogInToggle) {
      loginPass.type = "text";
      eyeIconLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
    } else {
      loginPass.type = "password";
      eyeIconLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  });

  loginPass.addEventListener("input", () => {
    if (loginPass.value.length > 0) {
      eyeIconLogin.style.display = "inline";
    } else {
      eyeIconLogin.classList.add("hideEyeIcon");

      setTimeout(() => {
        eyeIconLogin.classList.remove("hideEyeIcon");
        eyeIconLogin.style.display = "none";
        loginPass.type = "password";
        LogInToggle = false;
        eyeIconLogin.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
      }, 200);
    }
  });

  const registerPass = document.getElementById("registerPassword");
  const confirmPass = document.getElementById("confirmPassword");
  const eyeIconRegister = document.getElementById("togglePasswordRegister");
  const eyeIconConfirm = document.getElementById(
    "togglePasswordConfirmRegister"
  );
  let RegisterToggle = false;
  let ConfirmToggle = false;
  eyeIconRegister.addEventListener("click", () => {
    RegisterToggle = !RegisterToggle;
    if (RegisterToggle) {
      registerPass.type = "text";
      eyeIconRegister.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
    } else {
      registerPass.type = "password";
      eyeIconRegister.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  });
  eyeIconConfirm.addEventListener("click", () => {
    ConfirmToggle = !ConfirmToggle;
    if (ConfirmToggle) {
      confirmPass.type = "text";
      eyeIconConfirm.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
    } else {
      confirmPass.type = "password";
      eyeIconConfirm.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  });

  registerPass.addEventListener("input", () => {
    if(registerPass.value.length > 30) {
      registerPass.value = registerPass.value.slice(0, 30);
    }
    if (registerPass.value.length > 0) {
      eyeIconRegister.style.display = "inline";
    } else {
      eyeIconRegister.classList.add("hideEyeIcon");

      setTimeout(() => {
        eyeIconRegister.classList.remove("hideEyeIcon");
        eyeIconRegister.style.display = "none";
        registerPass.type = "password";
        RegisterToggle = false;
        eyeIconRegister.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
      }, 200);
    }
  });
  confirmPass.addEventListener("input", () => {
    if(confirmPass.value.length > 30) {
      confirmPass.value = confirmPass.value.slice(0, 30);
    }
    if (confirmPass.value.length > 0) {
      eyeIconConfirm.style.display = "inline";
    } else {
      eyeIconConfirm.classList.add("hideEyeIcon");

      setTimeout(() => {
        eyeIconConfirm.classList.remove("hideEyeIcon");
        eyeIconConfirm.style.display = "none";
        confirmPass.type = "password";
        ConfirmToggle = false;
        eyeIconConfirm.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
      }, 200);
    }
  });
});

// Get elements first
const body = document.body;
const loginBox = document.querySelector("#loginBox");
const registerBox = document.querySelector("#registerBox");

// Set initial state based on URL hash or default to login
if (loginBox && registerBox) {
  const urlParam = new URLSearchParams(window.location.search);
  const method = urlParam.get("method");
  if (method === "1") {
    body.classList.remove("show-login");
    body.classList.add("show-register");
    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");
  } else {
    body.classList.remove("show-register");
    body.classList.add("show-login");
    loginBox.classList.remove("hidden");
    registerBox.classList.add("hidden");
  }
}

// Toggle between login and register within the page
const goRegisterBtn = document.querySelector("#goRegister");
const goLoginBtn = document.querySelector("#goLogin");

if (goRegisterBtn) {
  goRegisterBtn.onclick = (e) => {
    e.preventDefault();
    body.classList.remove("show-login");
    body.classList.add("show-register");

    if (loginBox && registerBox) {
      loginBox.classList.remove("active");
      registerBox.classList.add("active");
      loginBox.classList.add("hidden");
      registerBox.classList.remove("hidden");
    }

     showUserRegisterForm();
  };
}

if (goLoginBtn) {
  goLoginBtn.onclick = (e) => {
    e.preventDefault();
    body.classList.remove("show-register");
    body.classList.add("show-login");

    if (registerBox && loginBox) {
      registerBox.classList.remove("active");
      loginBox.classList.add("active");
      registerBox.classList.add("hidden");
      loginBox.classList.remove("hidden");
    }

    showUserRegisterForm();
  };
}
const errorMsgLogin = document.getElementById("errorMsgLogin");
const form = document.getElementById("loginForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("logInEmail");
  const password = document.getElementById("logInPassword");

  let emailVal = (email.value = email.value.trim());
  let passwordVal = (password.value = password.value.trim());

  if (emailVal === "" || passwordVal === "") {
    errorMsgLogin.textContent = "Please fill in all fields.";
    return;
  }
  const formData = new FormData();
  formData.append("email", emailVal);
  formData.append("password", passwordVal);

  fetch("../php/login.php", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
      return await res.json();
    })
    .then((data) => {
      if (data.status === "error") {
        errorMsgLogin.style.color = "var(--error)";
        errorMsgLogin.textContent = data.message;
      } else {
        errorMsgLogin.style.color = "var(--success)";
        errorMsgLogin.textContent = data.message;
        window.location.href = data.redirect;
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      errorMsgLogin.textContent = "Something went wrong. Please try again.";
    });
});


const Regform = document.getElementById("registerForm");
const errorMsgReg = document.getElementById("errorMsgReg");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
Regform.addEventListener("submit", async (e) => {
  e.preventDefault();
  let passwordVal = (registerPassword.value = registerPassword.value.trim());
  let confirmPasswordVal = (confirmPassword.value =
    confirmPassword.value.trim());

  // PASSWORD VALIDATIONS
  let numbers = /[0-9]/g;
  
  const f_name = document.getElementById("fname").value.trim();
  const l_name = document.getElementById("lname").value.trim();
  if (f_name.length === 0 || l_name.length === 0) {
    errorMsgReg.textContent = "First name and Last name cannot be empty.";
    return;
  }
  
  if (numbers.test(f_name) || numbers.test(l_name)) {
    errorMsgReg.textContent = "Names cannot contain numbers.";
    return;
  }
  let specialChars = /[!@#$%^&*(),.?":{}|<>]/g;
  if (specialChars.test(f_name) || specialChars.test(l_name)) {
    errorMsgReg.textContent = "Names cannot contain special characters.";
    return;
  }
  
  if (passwordVal.length < 8) {
    errorMsgReg.textContent = "Password must be at least 8 characters long.";
    return;
  }
  //regular expression to check for lowercase letters
  let lowerCaseLetters = /[a-z]/g;
  if (!passwordVal.match(lowerCaseLetters)) {
    errorMsgReg.textContent =
      "Password must contain at least one lowercase letter.";
    return;
  }
  //regular expression to check for uppercase letters
  let upperCaseLetters = /[A-Z]/g;
  if (!passwordVal.match(upperCaseLetters)) {
    errorMsgReg.textContent =
      "Password must contain at least one uppercase letter.";
    return;
  }
  //regular expression to check for numbers
  if (!passwordVal.match(numbers)) {
    errorMsgReg.textContent = "Password must contain at least one number.";
    return;
  }

  let notAllowedChars = /[<>\/\\'"]/g;
  if (passwordVal.match(notAllowedChars)) {
    errorMsgReg.textContent = "Password contains invalid characters.";
    return;
  }

  for (let char of passwordVal) {
    if (char === " ") {
      errorMsgReg.textContent = "Password cannot contain spaces.";
      return;
    }
  }

  if (passwordVal !== confirmPasswordVal) {
    errorMsgReg.textContent = "Passwords do not match.";
    return;
  }

  errorMsgReg.textContent = "";
  const formData = new FormData();
  formData.append("fname", f_name);
  formData.append("lname", l_name);
  formData.append("password", passwordVal);
  formData.append("confirm", confirmPasswordVal);
  formData.append("email", document.getElementById("registerEmail").value.trim());
  formData.append("gender", document.querySelector('input[name="gender"]:checked').value);

  fetch("../php/register.php", {
    method: "POST",
    body: formData,
  }).then((res) => res.json()).then((data) => {
      if (data.status === "error") {
        errorMsgReg.style.color = "var(--error)";
        errorMsgReg.textContent = data.message;
      } else {
        errorMsgReg.style.color = "var(--success)";
        errorMsgReg.textContent = data.message;
        setTimeout(() => {
          window.location.href = "./login-register.html?method=2";
        }, 1000);
      }
    })
    .catch(() => {
      errorMsgReg.textContent = "Something went wrong. Please try again.";
    });
});

// Company register form handler
const companyForm = document.getElementById("companyRegisterForm");
const errorMsgCompany = document.getElementById("errorMsgCompany");
if (companyForm && errorMsgCompany) {
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(companyForm);
    
    fetch("../php/register-company.php", {
      method: "POST",
      body: formData,
    }).then((res) => res.json()).then((data) => {
      if (data.status === "error") {
        errorMsgCompany.style.color = "var(--error)";
        errorMsgCompany.textContent = data.message;
      } else {
        errorMsgCompany.style.color = "var(--success)";
        errorMsgCompany.textContent = data.message;
        setTimeout(() => {
          window.location.href = "./login-register.html?method=2";
        }, 1000);
      }
    }).catch(() => {
      errorMsgCompany.textContent = "Something went wrong. Please try again.";
    });
  });
}

const regCompanyLink = document.getElementById("regcomp");
const userRegisterForm = document.getElementById("registerForm");
const companyRegisterForm = document.getElementById("companyRegisterForm");
const changeToRegComp = document.getElementById("changetoregcomp");

let isCompanyRegister = false;

function showUserRegisterForm() {
  if (!userRegisterForm || !companyRegisterForm) return;
  userRegisterForm.classList.remove("hidden");
  companyRegisterForm.classList.add("hidden");
  isCompanyRegister = false;

  // reset link text to default
  if (changeToRegComp) {
    changeToRegComp.innerHTML = `
      Want to register a company?
      <a id="regcomp">Register</a>
    `;
  }
}

function showCompanyRegisterForm() {
  if (!userRegisterForm || !companyRegisterForm) return;
  userRegisterForm.classList.add("hidden");
  companyRegisterForm.classList.remove("hidden");
  isCompanyRegister = true;

  // change text to "Register an account"
  if (changeToRegComp) {
    changeToRegComp.innerHTML = `
      Register an account
      <a id="regcomp">Register</a>
    `;
  }
}

if (changeToRegComp) {
  changeToRegComp.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id !== "regcomp") return;

    e.preventDefault();
    if (isCompanyRegister) {
      showUserRegisterForm();
    } else {
      showCompanyRegisterForm();
    }
  });
}
