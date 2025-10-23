import {
  jobListings,
  getSVG,
  timeSince,
  toggleBookmark,
  userBookMarks,
} from "./jobs.js";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const button = e.target.closest(".job-form-button");
    if (!button) return;

    const parentJobCard = button.closest(".job-card");
    if (!parentJobCard) return;

    const jobId = Number(parentJobCard.getAttribute("data-id"));
    const job = jobListings.find((job) => job.id === jobId);
    const blurDiv = document.createElement("div");
    blurDiv.classList.add("ParentBlurDiv");

    const formDiv = document.createElement("div");
    formDiv.classList.add("formDiv");

    blurDiv.appendChild(formDiv);

    blurDiv.addEventListener("click", (ev) => {
      if (ev.target === blurDiv) {
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
    const spanInner = document.createElement("span");
    spanInner.classList.add("material-symbols-outlined");
    spanInner.textContent = "close";

    closeBtn.classList.add("close-btn");
    closeBtn.appendChild(spanInner);
    closeBtn.addEventListener("click", () => {
      blurDiv.remove();
    });
    upperDivContent(job, upperDiv);
    upperDiv.appendChild(closeBtn);

    const formRightDiv = document.createElement("div");
    formRightDiv.classList.add("formRightDiv");

    lowerDiv.appendChild(formLeftDiv);
    lowerDiv.appendChild(formRightDiv);

    document.body.appendChild(blurDiv);
  });
});

function upperDivContent(job, upperDiv) {
  upperDiv.innerHTML = `
  <svg class="job-bookmark form-bookmark ${
    userBookMarks.includes(job.id) ? "bookmarked" : ""
  }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    <div class="job-info-form">
        <p class="job-posted-time-form">${timeSince(job.datePosted)}</p>
        
        <div class="job-header-form">
          <img src="${job.logo}" alt="${job.company} Logo" class="job-logo-form" />
          <div class="job-header-info">
            <h2 class="job-title-form">${job.title}</h2>
            <p class="job-company-form">${job.company}</p>
          </div>
        </div>

        <div class="job-details-row">

            <div class="job-detail-item">
                ${getSVG(job.category)}
                ${job.category}
            </div>

            <div class="job-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                       <polyline points="12,6 12,12 16,14"></polyline>
               </svg>
               <span class="job-type-badge">${
                 job.type
               }</span>

            </div>

            <div class="job-detail-item">

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
               ${job.salary}
            </div>

            <div class="job-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-icon lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                ${job.experience}
            </div>

            <div class="job-detail-item">  
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${job.location}
            </div>
        </div>  
    `;

  const bookmarkEl = upperDiv.querySelector(".job-bookmark");
  if (bookmarkEl) {
    bookmarkEl.addEventListener("click", (e) => {
      const clicked = e.target.closest(".job-bookmark");
      if (!clicked) return;
      e.stopPropagation();
      toggleBookmark(job.id);
    });
  }
}
