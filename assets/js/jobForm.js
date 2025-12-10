import {
  jobListings,
  getSVG,
  timeSince,
  toggleBookmark,
  userBookMarks,
} from "./jobs.js";

function showJobDetails(job) {
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
    leftDivContent(job, formLeftDiv);

    const closeBtn = document.createElement("button");
    const spanInner = document.createElement("span");
    spanInner.classList.add("close-btn-inner");
    spanInner.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
    `;

    closeBtn.classList.add("close-btn");
    closeBtn.appendChild(spanInner);
    closeBtn.addEventListener("click", () => {
      blurDiv.remove();
    });
    upperDivContent(job, upperDiv);
    upperDiv.appendChild(closeBtn);

    const formRightDiv = document.createElement("div");
    formRightDiv.classList.add("formRightDiv");
    rightDivContent(job, formRightDiv);

    lowerDiv.appendChild(formLeftDiv);
    lowerDiv.appendChild(formRightDiv);

    document.body.appendChild(blurDiv);
}

function rightDivContent(job, formRightDiv) {
  formRightDiv.innerHTML = `
    <form class="application-form">
      <h2 class="application-form-title">Apply for ${job.job_title}</h2>
      <label for="full-name">Full Name <span class="required">*</span></label>
      <input type="text" id="full-name" name="full-name" required />
      <label for="email">Email Address <span class="required">*</span></label>
      <input type="email" id="email" name="email" required />
      <label for="resume">Resume <span class="required">*</span></label>
      <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required />
      <label for="cover-letter">Cover Letter <span class="required">*</span></label>
      <textarea id="cover-letter" name="cover-letter" rows="4" required></textarea>
      <label for="note">Additional Note</label>
      <textarea id="note" name="note" rows="3"></textarea>
      <label for="experience-level">Experience Level <span class="required">*</span></label>
      <select id="experience-level" name="experience-level" required>
        <option value="" disabled selected>Select your experience level</option>
        <option value="entry-level">Entry Level</option>
        <option value="mid-level">Mid Level</option>
        <option value="senior-level">Senior Level</option>
      </select>
      <button type="submit" id="${job.job_id}">Submit Application</button>
      <p id="form-message" style="margin-top: 10px; font-weight: bold;"></p>

    </form>
  `;
  const form = formRightDiv.querySelector("form.application-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    formData.append("job_id", job.job_id);

    try {
      const response = await fetch("../php/job-application.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

     if (result.success){
    messageBox.textContent = result.message;
    messageBox.style.color = "green";
    form.reset();
  } else{
    messageBox.textContent = "Error: " +result.message;
    messageBox.style.color = "red";
  }

} catch(error) {
  const messageBox = document.getElementById("form-message");
  messageBox.textContent = "An error occurred while submitting the application.";
  messageBox.style.color = "red";
  console.error("Error:", error);
}
  });
}

function leftDivContent(job, formLeftDiv) {
  formLeftDiv.innerHTML = `
  <div class="details-container">
    <h2 class="job-description-title">Job Description</h2>
    <p class="job-description-content">${job.job_description}</p>
    <h2 class="job-skills-title">Required Skills</h2>
    <ul class="job-skills-list">
      ${job.skill.map(skill => `<li class="job-skill">${skill}</li>`).join("")}
    </ul>

    <h2 class="job-tags-title">Tags:</h2>
    <div class="job-tags-container">
      ${job.tag.map(tag => `<span class="job-tag">${tag}</span>`).join("")}
    </div> 

    <a href="${job.website}" target="_blank" class="companyWebsite">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      Visit Company Website
    </a>
  </div>
  `
}



function upperDivContent(job, upperDiv) {
  upperDiv.innerHTML = `
  <svg class="job-bookmark form-bookmark ${
    userBookMarks.includes(job.id) ? "bookmarked" : ""
  }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    <div class="job-info-form">
        <p class="job-posted-time-form">${timeSince(job.created_at)}</p>
        
        <div class="job-header-form">
          <img src="${job.logo}" alt="${job.company_name} Logo" class="job-logo-form" />
          <div class="job-header-info">
            <h2 class="job-title-form">${job.job_title}</h2>
            <p class="job-company-form">${job.company_name}</p>
          </div>
        </div>

        <div class="job-details-row">

            <div class="job-detail-item job-detail-item-form">
                ${getSVG(job.category)}
                ${job.category}
            </div>

            <div class="job-detail-item job-detail-item-form">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                       <polyline points="12,6 12,12 16,14"></polyline>
               </svg>
               <span>${
                 job.job_type
               }</span>

            </div>

            <div class="job-detail-item job-detail-item-form">

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
               ${job.salary}
            </div>

            <div class="job-detail-item job-detail-item-form">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-icon lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                ${job.experience}
            </div>

            <div class="job-detail-item job-detail-item-form">  
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
      bookmarkEl.classList.toggle("bookmarked", userBookMarks.includes(job.id));
    });
  }

}

export { showJobDetails };