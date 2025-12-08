const dummyJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "New York, NY",
    creationDate: "15/11/2025",
    description:
      "We are looking for a skilled Frontend Developer to join our team.",
    skillsRequired: ["HTML", "CSS", "JavaScript", "React"],
    tags: ["Full-time", "Remote", "Mid-Level"],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Innovatech Corp.",
    location: "San Francisco, CA",
    creationDate: "10/11/2025",
    description:
      "Seeking a Backend Developer with experience in Node.js and databases.",
    skillsRequired: ["Node.js", "Express", "MongoDB", "SQL"],
    tags: ["Full-time", "On-site", "Senior-Level"],
  },
];
const dummyApplications = [
  {
    id: 1,
    applicantId: 1,
    jobId: 1,
    name: "John Doe",
    image: "1/profile_1763214550.png",
    email: "john.doe@example.com",
    resume: "1/resume.pdf",
    status: "Accepted",
    appliedDate: "25/11/2025",
    coverLetter: "lorem ipsum dolor sit amet",
    additionalNote: "lorem ipsum dolor sit amet",
    experienceLevel: "Mid-Level",
  },
  {
    id: 2,
    applicantId: 2,
    jobId: 1,
    name: "Jane Smith",
    image: "profile.jpeg",
    email: "jane.smith@example.com",
    resume: "2/resume.pdf",
    status: "Pending",
    appliedDate: "20/11/2025",
    coverLetter: "lorem ipsum dolor sit amet",
    additionalNote: "lorem ipsum dolor sit amet",
    experienceLevel: "Senior-Level",
  },
];

const urlParams = new URLSearchParams(window.location.search);
const JobId = urlParams.get("jobId");
const formdata = new FormData();
formdata.append("jobid", JobId)
fetch('/php/job-application-view.php', { 
        method: 'POST',
        body: formdata
    })
    .then((Response) => Response.json())
    .then((data)=>{
    console.log(data);
    })

const job = dummyJobs.find((job) => job.id == JobId);
if (job) {
    $(document).ready(function () {
    $(".job-title").text(job.title);
    $(".company-name").text(job.company);
    $(".job-location").text(job.location);
    $(".job-creation-date").text(job.creationDate);
    $("#job-description").text(job.description);
    $("#skills-required").empty();
    job.skillsRequired.forEach(skill => {
      $("#skills-required").append(`<li>${skill}</li>`);
    });
    $("#job-tags").empty();
    job.tags.forEach(tag => {
      $("#job-tags").append(`<li class="job-tag">${tag}</li>`);
    });
    const applications = dummyApplications.filter((app) => app.jobId == JobId);
    $("#total-applications").text(applications.length);
    const applicants = $("#applicants");
    applicants.empty();
    applications.forEach((app) => {
      const applicantCard = `
        <div class="application-card" data-applicant-id="${app.applicantId}">
        <a href="/pages/profile.html?id=${
          app.applicantId
        }" class="applicant-profile-link">
            <img src="/ImageStorage/${app.image}" alt="${
        app.name
      }" class="applicant-profile-img" loading="lazy" />
            <h2 class="applicant-name">${app.name}</h2>
        </a>
        <div class="application-status">
            <span class="status-label">${app.status}</span>
            <div class="status-dot ${app.status.toLowerCase()}"></div>
        </div>
        <p class="applicant-email">${app.email}</p>
        <p class="application-date">Applied on: ${app.appliedDate}</p>
        <div class="application-actions">
            <a href="/CVStorage/${
              app.resume
            }" class="view-resume-btn" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              </svg>
              View Resume
            </a>
            <a href="mailto:${app.email}" class="contact-applicant-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Contact Applicant
            </a>

         <button class="view-application-btn" id="view-application-${app.applicantId}">View Application</button>
         </div>
        </div>
        `;
      $(`#view-application-${app.applicantId}`).click(function () {
        openPopUp(app.applicantId);
      });
      
    const $card = $(applicantCard).hide();
    applicants.append($card);
    $card.slideDown(1000);
    $card.find(`#view-application-${app.applicantId}`).on('click', function () {
      openPopUp(app.applicantId);
    });});
  });
}

function openPopUp(applicantId) {
  const application = dummyApplications.find(
    (app) => app.applicantId == applicantId
  );

  const popup = document.createElement("div");
  $("body").addClass("popup-open-job-application");
  popup.classList.add("popup-overlay-job-application");
    popup.innerHTML = `
    <div class="popup-content-job-application">
      <span class="close-popup-job-application">&times;</span>
      <img src="/ImageStorage/${application.image}" alt="${application.name}" class="popup-applicant-image" />
      <h2 class="popup-applicant-name">${application.name}</h2>
        <p class="popup-applicant-email">Email: ${application.email}</p>
        <p class="popup-application-date">Applied on: ${application.appliedDate}</p>
        <h3>Cover Letter</h3>
        <p class="popup-cover-letter">${application.coverLetter}</p>
        <h3>Additional Note</h3>
        <p class="popup-additional-note">${application.additionalNote}</p>
        <p class="popup-experience-level">Experience Level: ${application.experienceLevel}</p>
        <div class="popup-actions">
            <a href="/CVStorage/${application.resume}" class="view-resume-btn-popup" target="_blank">View Resume</a>
            <a href="mailto:${application.email}" class="contact-applicant-btn-popup">Contact Applicant</a>
            <a href="/pages/profile.html?id=${application.applicantId}" class="view-full-profile-btn-popup">View Full Profile</a>
        </div>
        <div class ="popup-decision-buttons">
            <button class="accept-btn">Accept</button>
            <button class="reject-btn">Reject</button>
            <button class="hold-btn">Hold</button>
        </div>
    </div>
    `;
    
    const $popupScoped = $(popup);
    if (application.status === "Accepted") {
        $popupScoped.find(".accept-btn").addClass("disabled-button").prop("disabled", true);
    }
    if (application.status === "Rejected") {
        $popupScoped.find(".reject-btn").addClass("disabled-button").prop("disabled", true);
    }
    if (application.status === "Pending") {
        $popupScoped.find(".hold-btn").addClass("disabled-button").prop("disabled", true);
    }
    const $popup = $(popup);
    $popup.hide().appendTo("body").fadeIn(300);
    $(".close-popup-job-application").click(function () {
      popup.remove();
    $("body").removeClass("popup-open-job-application");
    });

    $("#blurred-background").click(function () {
      popup.remove();
    $("body").removeClass("popup-open-job-application");
    });
}