document.addEventListener("DOMContentLoaded", () => {
    const jobFormButtons = document.querySelectorAll(".job-form-button");
    jobFormButtons.forEach(button => {
        button.addEventListener("click", () => {
            const blurDiv = document.createElement("div");
            blurDiv.classList.add("ParentBlurDiv");

            const formDiv = document.createElement("div");
            formDiv.classList.add("formDiv");
            
            blurDiv.appendChild(formDiv);

            blurDiv.addEventListener("click", (e) => {
                if (e.target === blurDiv) {
                    blurDiv.remove();
                }
            });

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
                blurDiv.remove();
            });
            upperDiv.appendChild(closeBtn);

            const formRightDiv = document.createElement("div");
            formRightDiv.classList.add("formRightDiv");
            
            lowerDiv.appendChild(formLeftDiv);
            lowerDiv.appendChild(formRightDiv);

            document.body.appendChild(blurDiv);
        });
    });
});