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
  // Only target login text inputs; avoid submit buttons
  const inputs = document.querySelectorAll("#email, #password");
  inputs.forEach((input) => {
    const label = getLabelForInput(input);
    if (!label) return;
    const text = (label.textContent || "").trim();
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
  // Only target register text/password/email fields; skip radios/submit
  const inputs = document.querySelectorAll(
    "#fname, #lname, #email, #password, #confirm"
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
});

// Get elements first
const body = document.body;
const loginBox = document.querySelector("#loginBox");
const registerBox = document.querySelector("#registerBox");

// Set initial state based on URL hash or default to login
if (loginBox && registerBox) {
  const hash = window.location.hash;

  if (hash === "#register") {
    body.classList.remove("show-login");
    body.classList.add("show-register");
      registerBox.classList.remove("hidden");
      loginBox.classList.add("hidden");
  } else {
    body.classList.remove("show-register");
    body.classList.add("show-login");
    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
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
      registerBox.classList.remove("hidden");
      loginBox.classList.add("hidden");
    }
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
  };
}
