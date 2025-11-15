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
