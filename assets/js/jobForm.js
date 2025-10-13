document.addEventListener("DOMContentLoaded", () => {
    const jobFormButtons = document.querySelectorAll(".job-form-button");
    jobFormButtons.forEach(button => {
        button.addEventListener("click", () => {
            const formDiv = document.createElement("div");
            formDiv.classList.add("formDiv");
            
            const formLeftDiv = document.createElement("div");
            formLeftDiv.classList.add("formLeftDiv");
            
            const closeBtn = document.createElement("button");
            closeBtn.classList.add("FormCloseBtn");
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => {
                formDiv.remove();
            });
            formLeftDiv.appendChild(closeBtn);

            const formRightDiv = document.createElement("div");
            formRightDiv.classList.add("formRightDiv");
            
            formDiv.appendChild(formLeftDiv);
            formDiv.appendChild(formRightDiv);
            
            document.body.appendChild(formDiv);
        });
    });
});