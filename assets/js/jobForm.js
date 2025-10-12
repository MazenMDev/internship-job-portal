document.addEventListener("DOMContentLoaded", () => {
    const jobFormButtons = document.querySelectorAll(".job-form-button");
    jobFormButtons.forEach(button => {
        button.addEventListener("click", () => {
            const formDiv = document.createElement("div");
            formDiv.classList.add("formDiv");
            document.body.appendChild(formDiv);

            const closeBtn = document.createElement("button");
            closeBtn.classList.add("FormCloseBtn");
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => {
                formDiv.remove();
            });
            formDiv.appendChild(closeBtn);
        });
    });
});