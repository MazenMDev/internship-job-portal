$(window).on("load", function () {
  if ($(".container").length > 0) {
    $(".container").css("opacity", "0").animate({ opacity: 1 }, 500);

    $(".container > *").each(function (i) {
      $(this)
        .css("opacity", "0")
        .delay(i * 50)
        .animate({ opacity: 1 }, 400);
    });
  } else if ($("main").length > 0) {
    $("main").css("opacity", "0").animate({ opacity: 1 }, 500);
    $("main > *").each(function (i) {
      $(this)
        .css("opacity", "0")
        .delay(i * 50)
        .animate({ opacity: 1 }, 400);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-btn");
  const closeBtn = document.getElementById("close-btn");

  function openModal() {
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    document.body.classList.remove("modal-open");
  }

  if (openBtn && closeBtn) {
    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
  }

  const settingsToggle = document.getElementById("settingsToggle");
  const settingsMenu = document.getElementById("settingsMenu");
  const changeEmailBtn = document.getElementById("changeEmailBtn");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

  settingsToggle.addEventListener("click", function () {
    this.classList.toggle("active");
    settingsMenu.classList.toggle("active");
  });

  changeEmailBtn.addEventListener("click", function () {
    createPopUp(true, false);
  });

  forgotPasswordBtn.addEventListener("click", function () {
    createPopUp(false, true);
  });

  const companyForm = document.getElementById("form");
});

function createPopUp(mail = false, password = true) {
  document.body.classList.add("popup-open");
  if (mail) {
    const popupMail = document.createElement("div");
    popupMail.classList.add("popup-mail");
    popupMail.classList.add("popup-change");

    popupMail.innerHTML = `
      <form class="popup-content">
        <span class="close-mail-btn">&times;</span>
        <h2>Change Email</h2>
        <p class="popup-info">A verification email will be sent to your current email address. After confirming, another verification will be sent to your new email.</p>
        <input type="email" id="newEmail" required placeholder="Enter new email" />
        <input type="password" id="currentPassword" required placeholder="Enter current password" />
        <p class="errorPopup"></p>
        <button id="submitEmailBtn">Send Verification</button>
      </form>
    `;
    document.body.appendChild(popupMail);
    document
      .querySelector(".close-mail-btn")
      .addEventListener("click", function () {
        document.body.classList.remove("popup-open");
        document.body.removeChild(popupMail);
      });

    document
      .querySelector(".popup-content")
      .addEventListener("submit", (Event) => {
        Event.preventDefault();
        const newEmail = document.getElementById("newEmail").value;
        const currentPassword = document.getElementById("currentPassword").value;
        const submitBtn = document.getElementById("submitEmailBtn");
        const errorEl = document.querySelector(".errorPopup");
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        errorEl.textContent = "";
        errorEl.style.color = "var(--error)";
        
        const formData = new FormData();
        formData.append("current_password", currentPassword);
        formData.append("new_email", newEmail);
        formData.append("change_type", "email");
        
        fetch("../php/request-account-change.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              errorEl.textContent = data.message;
              errorEl.style.color = "var(--success)";
              submitBtn.textContent = "Email Sent!";
              setTimeout(() => {
                document.body.classList.remove("popup-open");
                document.body.removeChild(popupMail);
              }, 3000);
            } else {
              errorEl.innerHTML = data.message;
              if (data.time_left) {
                const minutes = Math.floor(data.time_left / 60);
                const seconds = data.time_left % 60;
                errorEl.innerHTML += ` (${minutes}m ${seconds}s remaining)`;
              }
              submitBtn.disabled = false;
              submitBtn.textContent = "Send Verification";
            }
          })
          .catch(() => {
            errorEl.textContent = "An error occurred. Please try again.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Verification";
          });
      });
  } else if (password) {
    const popupPass = document.createElement("div");
    popupPass.classList.add("popup-pass");
    popupPass.classList.add("popup-change");
    popupPass.innerHTML = `
      <form class="popup-content">
        <span class="close-pass-btn">&times;</span>
        <h2>Change Password</h2>
        <p class="popup-info">A verification email will be sent to confirm your identity before changing the password.</p>
        <input type="password" id="currentPassword" required placeholder="Enter current password" />
        <p class="errorPopup"></p>
        <button id="submitPassBtn">Send Verification</button>
      </form>
    `;

    document.body.appendChild(popupPass);
    document
      .querySelector(".close-pass-btn")
      .addEventListener("click", function () {
        document.body.classList.remove("popup-open");
        document.body.removeChild(popupPass);
      });

    document
      .querySelector(".popup-content")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const currentPassword = document.getElementById("currentPassword").value;
        const submitBtn = document.getElementById("submitPassBtn");
        const errorEl = document.querySelector(".errorPopup");
        
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        errorEl.textContent = "";
        errorEl.style.color = "var(--error)";

        const formData = new FormData();
        formData.append("current_password", currentPassword);
        formData.append("change_type", "password");
        
        fetch("../php/request-account-change.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              errorEl.textContent = data.message;
              errorEl.style.color = "var(--success)";
              submitBtn.textContent = "Email Sent!";
              setTimeout(() => {
                document.body.classList.remove("popup-open");
                document.body.removeChild(popupPass);
              }, 3000);
            } else {
              errorEl.innerHTML = data.message;
              if (data.time_left) {
                const minutes = Math.floor(data.time_left / 60);
                const seconds = data.time_left % 60;
                errorEl.innerHTML += ` (${minutes}m ${seconds}s remaining)`;
              }
              submitBtn.disabled = false;
              submitBtn.textContent = "Send Verification";
            }
          })
          .catch(() => {
            errorEl.textContent = "An error occurred. Please try again.";
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Verification";
          });
      });
  }

  document
    .getElementById("blurred-background")
    .addEventListener("click", function () {
      document.body.classList.remove("popup-open");
      if (document.querySelector(".popup-change")) {
        const popup = document.querySelector(".popup-change");

        document.body.removeChild(popup);
      }
    });
}
