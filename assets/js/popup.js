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

function createPopUp(mail = false , password = true){
  document.body.classList.add("popup-open");
  if(mail){
    const popupMail = document.createElement("div");
    popupMail.classList.add("popup-mail");
    popupMail.classList.add("popup-change");

    popupMail.innerHTML = `
      <div class="popup-content">
        <span class="close-mail-btn">&times;</span>
        <h2>Change Email</h2>
        <input type="email" id="newEmail" placeholder="Enter new email" />
        <input type="password" id="currentPassword" placeholder="Enter current password" />
        <button id="submitEmailBtn">Submit</button>
      </div>
    `;
    document.body.appendChild(popupMail);
    document.querySelector(".close-mail-btn").addEventListener("click", function(){
      document.body.classList.remove("popup-open");
      document.body.removeChild(popupMail);
    });
  }
  else if(password){
    const popupPass = document.createElement("div");
    popupPass.classList.add("popup-pass");
    popupPass.classList.add("popup-change");
    popupPass.innerHTML = `
      <div class="popup-content">
        <span class="close-pass-btn">&times;</span>
        <h2>Forgot Password</h2>
        <input type="password" id="currentPassword" placeholder="Enter current password" />
        <input type="password" id="newPassword" placeholder="Enter new password" />
        <input type="password" id="confirmNewPassword" placeholder="Confirm new password" />
        <button id="submitPassBtn">Submit</button>
      </div>
    `;
    
    document.body.appendChild(popupPass);
    document.querySelector(".close-pass-btn").addEventListener("click", function(){
      document.body.classList.remove("popup-open");
      document.body.removeChild(popupPass);
    });
  }

  document.getElementById("blurred-background").addEventListener("click", function(){
    document.body.classList.remove("popup-open");
    const popup = document.querySelector(".popup-change");
    if(popup){
      document.body.removeChild(popup);
    }
  });
}