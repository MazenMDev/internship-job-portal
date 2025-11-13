document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("photo");
  const closeBtn = document.getElementById("close-btn");
  const backdrop = document.getElementById("blurred-background");

  document.getElementById("view-photo").addEventListener("click", openModal);
  function openModal() {
    document.body.classList.add("view-open");
  }

  function closeModal() {
    document.body.classList.remove("view-open");
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
});
