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
  
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsMenu = document.getElementById('settingsMenu');
  const changeEmailBtn = document.getElementById('changeEmailBtn');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  settingsToggle?.addEventListener('click', function() {
    this.classList.toggle('active');
    settingsMenu.classList.toggle('active');
  });

  changeEmailBtn?.addEventListener('click', function() {
    alert('Change Email clicked');
  });

  forgotPasswordBtn?.addEventListener('click', function() {
    alert('Forgot Password clicked');
  });
});
