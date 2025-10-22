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
});