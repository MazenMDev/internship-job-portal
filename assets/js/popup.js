$("#open-btn").click(function () {
  $("#companyreg").show();
  $("#blurred-background").show();
});
$("#close-btn , #blurred-background").click(function () {
  $("#companyreg").hide();
  $("#blurred-background").hide();
});
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-btn");
  const closeBtn = document.getElementById("close-btn");
  const backdrop = document.getElementById("blurred-background");

  function openModal() {
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    document.body.classList.remove("modal-open");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

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
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(companyForm);
    const response = await fetch("../php/register_company.php", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status === "success") {
      alert("Company registered successfully!");
      companyForm.reset();
      closeModal();
    } else {
      alert("Error: " + result.message);
    }
  });
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
        <input type="email"  id="newEmail" required placeholder="Enter new email" />
        <input type="password" id="currentPassword" required placeholder="Enter current password" />
        <p class="errorPopup"></p>
        <button id="submitEmailBtn">Submit</button>
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
        const mail = document.getElementById("newEmail").value;
        const password = document.getElementById("currentPassword").value;
        const formData = new FormData();
        formData.append("current_password", password);
        formData.append("email", mail);
        fetch("../php/change-email.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              const error = document.querySelector(".errorPopup");
              error.textContent = "Email changed successfully.";
              error.style.color = "var(--success)";
              setTimeout(() => {
                document.body.classList.remove("popup-open");
                document.body.removeChild(popupMail);
                error.style.color = "var(--error)";

                error.textContent = "";
              }, 1000);
            } else {
              document.querySelector(".errorPopup").textContent = data.message;
            }
          });
      });
  } else if (password) {
    const popupPass = document.createElement("div");
    popupPass.classList.add("popup-pass");
    popupPass.classList.add("popup-change");
    popupPass.innerHTML = `
      <form class="popup-content">
        <span class="close-pass-btn">&times;</span>
        <h2>Forgot Password</h2>
        <input type="password" id="currentPassword" required placeholder="Enter current password" />
        <input type="password" id="newPassword" required placeholder="Enter new password" />
        <input type="password" id="confirmNewPassword" required placeholder="Confirm new password" />
        <p class="errorPopup"></p>
        <button id="submitPassBtn">Submit</button>
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
        document.querySelector(".errorPopup").textContent = "";
        const currentPassword =
          document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword =
          document.getElementById("confirmNewPassword").value;

        if (newPassword !== confirmNewPassword) {
          document.querySelector(".errorPopup").textContent =
            "New passwords do not match.";
          return;
        }
        if (newPassword.length < 8) {
          document.querySelector(".errorPopup").textContent =
            "New password must be at least 8 characters long.";
          return;
        }
        if (!/[A-Z]/.test(newPassword)) {
          document.querySelector(".errorPopup").textContent =
            "New password must contain at least one uppercase letter.";
          return;
        }
        if (!/[a-z]/.test(newPassword)) {
          document.querySelector(".errorPopup").textContent =
            "New password must contain at least one lowercase letter.";
          return;
        }
        if (!/[0-9]/.test(newPassword)) {
          document.querySelector(".errorPopup").textContent =
            "New password must contain at least one digit.";
          return;
        }
        let notAllowedChars = /[<>\/\\'"]/g;
        if (newPassword.match(notAllowedChars)) {
          document.querySelector(".errorPopup").textContent =
            "New password contains invalid characters.";
          return;
        }

        for (let char of newPassword) {
          if (char === " ") {
            document.querySelector(".errorPopup").textContent =
              "New password cannot contain spaces.";
            return;
          }
        }
        // If the password has nothong wrong, then post data to backend
        const formData = new FormData();
        formData.append("current_password", currentPassword);
        formData.append("new_password", newPassword);
        fetch("../php/change-password.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "success") {
              const error = document.querySelector(".errorPopup");
              error.textContent = "Password changed successfully.";
              error.style.color = "var(--success)";
              setTimeout(() => {
                document.body.classList.remove("popup-open");
                document.body.removeChild(popupPass);
                error.style.color = "var(--error)";

                error.textContent = "";
              }, 1000);
            } else {
              document.querySelector(".errorPopup").textContent = data.message;
            }
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
