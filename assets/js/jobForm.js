document.addEventListener("DOMContentLoaded", () => {
    const jobFormButtons = document.querySelectorAll(".job-form-button");
    jobFormButtons.forEach(button => {
        button.addEventListener("click", () => {
            const formDiv = document.createElement("div");
            formDiv.classList.add("formDiv");

            const upperDiv = document.createElement("div");
            upperDiv.classList.add("upperDiv");
            formDiv.appendChild(upperDiv);

            const lowerDiv = document.createElement("div");
            lowerDiv.classList.add("lowerDiv");
            formDiv.appendChild(lowerDiv);
            
            const formLeftDiv = document.createElement("div");
            formLeftDiv.classList.add("formLeftDiv");
            
            const closeBtn = document.createElement("button");
            closeBtn.classList.add("FormCloseBtn");
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => {
                formDiv.remove();
            });
            upperDiv.appendChild(closeBtn);

            const formRightDiv = document.createElement("div");
            formRightDiv.classList.add("formRightDiv");
            
            lowerDiv.appendChild(formLeftDiv);
            lowerDiv.appendChild(formRightDiv);

            document.body.appendChild(formDiv);
        });
    });
});