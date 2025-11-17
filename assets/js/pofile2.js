const accordionheaders = document.querySelectorAll(".accordion-header");
const accordioncontents = document.querySelectorAll(".accordion-content");
accordionheaders.forEach((header) => {
    header.addEventListener("click", () => {
        const accordionitem = header.parentElement;
        const accordioncontent = accordionitem.querySelector(".accordion-content");

        accordioncontents.forEach((content) => {
            if (content !== accordioncontent) {
                content.classList.remove("active");
                content.style.maxHeight = "0";
            }
        });

        accordioncontent.classList.toggle("active");

        if (accordioncontent.classList.contains("active")) {
            accordioncontent.style.maxHeight = accordioncontent.scrollHeight + "px";

        }
        else {
            accordioncontent.style.maxHeight = "0";
        }
    });
});