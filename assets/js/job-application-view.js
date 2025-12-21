const urlParams = new URLSearchParams(window.location.search);
const JobId = urlParams.get("jobId");
const formdata = new FormData();

formdata.append("jobid", JobId);
let jobsData = null;
fetch("/php/job-application-view.php", {
  method: "POST",
  body: formdata,
})
  .then((Response) => Response.json())
  .then((data) => {
    console.log(data);
    jobsData = data;
    const job = data.job;

    $(document).ready(function () {
      $(".job-title").text(job.job_title);
      $(".company-name").text(job.company_name);
      $(".job-location").text(job.location);
      $(".job-creation-date").text(job.created_at);
      $("#job-description").text(job.job_description);
      $("#skills-required").empty();
      job.skillsRequired.forEach((skill) => {
        $("#skills-required").append(`<li>${skill}</li>`);
      });
      $("#job-tags").empty();
      job.tags.forEach((tag) => {
        $("#job-tags").append(`<li class="job-tag">${tag}</li>`);
      });
      const applications = data.data;

      if (applications.length === 0) {
        $("#applicants").append(
          `<p class="no-applications-message">No applications found for this job.</p>`
        );
        $(".application-filters").hide();
        $("#total-applications").text("0");
        return;
      }
      $("#total-applications").text(applications.length);
      const applicants = $("#applicants");
      applicants.empty();
      applications.forEach((app) => {
        let hasCV = false;
        if (app.resume && app.resume.trim() !== "") {
          hasCV = true;
        }

        const applicantCard = `
        <div class="application-card" data-applicant-id="${app.user_id}">
        <a href="/pages/profile.html?id=${
          app.user_id
        }&type=user" class="applicant-profile-link">
            <img src="/ImageStorage/users/${app.user_id}/${app.image}" alt="${
          app.name
        }" class="applicant-profile-img" loading="lazy" />
            <h2 class="applicant-name">${app.name}</h2>
        </a>
        <div class="application-status">
            <span class="status-label">${app.status}</span>
            <div class="status-dot ${app.status.toLowerCase()}"></div>
        </div>
        <p class="applicant-email">${app.email}</p>
        <p class="application-date">Applied on: ${app.application_date}</p>
        <div class="application-actions">
            <a style = "${
              hasCV
                ? ""
                : "pointer-events: none; opacity: 0.5; cursor: default;"
            }" href="/CVStorage/${app.user_id}/${
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

         <button class="view-application-btn" id="view-application-${
           app.application_id
         }">View Application</button>
         </div>
        </div>
        `;
        $(`#view-application-${app.application_id}`).click(function () {
          openPopUp(app.application_id);
        });

        const $card = $(applicantCard).hide();
        applicants.append($card);
        $card.slideDown(1000);
        $card
          .find(`#view-application-${app.application_id}`)
          .on("click", function () {
            openPopUp(app.application_id);
          });
      });

      $("#statusFilter").on("change", function () {
        filterApplications();
      });

      $("#sortOrder").on("change", function () {
        sortApplications();
      });

      $("#clearFiltersBtn").on("click", function () {
        clearFilters();
      });
    });
  });

function openPopUp(applicationId) {
  const application = jobsData.data.find(
    (app) => app.application_id === applicationId
  );

  const popup = document.createElement("div");
  $("body").addClass("popup-open-job-application");
  popup.classList.add("popup-overlay-job-application");
  let hasCV = false;
  if (application.resume && application.resume.trim() !== "") {
    hasCV = true;
  }
  popup.innerHTML = `
    <div class="popup-content-job-application">
      <span class="close-popup-job-application">&times;</span>
      <img src="/ImageStorage/users/${application.user_id}/${
    application.image
  }" alt="${application.name}" class="popup-applicant-image" />
      <h2 class="popup-applicant-name">${application.name}</h2>
        <p class="popup-applicant-email">Email: ${application.email}</p>
        <p class="popup-application-date">Applied on: ${
          application.application_date
        }</p>
        <h3>Cover Letter</h3>
        <p class="popup-cover-letter">${application.cover_letter}</p>
        <h3>Additional Note</h3>
        <p class="popup-additional-note">${application.additional_note}</p>
        <p class="popup-experience-level">Experience Level: ${
          application.experience_level
        }</p>
        <div class="popup-actions">
            <a style = "${
              hasCV
                ? ""
                : "pointer-events: none; opacity: 0.5; cursor: default;"
            }" href="/CVStorage/${
    application.resume
  }" class="view-resume-btn-popup" target="_blank">View Resume</a>
            <a href="mailto:${
              application.email
            }" class="contact-applicant-btn-popup">Contact Applicant</a>
            <a href="/pages/profile.html?id=${
              application.user_id
            }&type=user" class="view-full-profile-btn-popup">View Full Profile</a>
        </div>
        <div class ="popup-decision-buttons">
            <button class="accept-btn" id="accept-btn-${
              application.application_id
            }">Accept</button>
            <button class="reject-btn" id="reject-btn-${
              application.application_id
            }">Reject</button>
            <button class="hold-btn" id="hold-btn-${
              application.application_id
            }">Hold</button>
        </div>
    </div>
    `;

  const $popupScoped = $(popup);
  if (application.status === "Accepted") {
    $popupScoped
      .find(".accept-btn")
      .addClass("disabled-button")
      .prop("disabled", true);
  }
  if (application.status === "Rejected") {
    $popupScoped
      .find(".reject-btn")
      .addClass("disabled-button")
      .prop("disabled", true);
  }
  if (application.status === "Pending") {
    $popupScoped
      .find(".hold-btn")
      .addClass("disabled-button")
      .prop("disabled", true);
  }

  $popupScoped
    .find("#accept-btn-" + application.application_id)
    .on("click", function () {
      if (application.status !== "Pending") return;
      const formdata = new FormData();
      formdata.append("application_id", application.application_id);
      formdata.append("new_status", "Accepted");
      fetch("/php/update-application-status.php", {
        method: "POST",
        body: formdata,
      })
        .then((Response) => Response.json())
        .then((data) => {
          if (data.success) {
            console.log("Application accepted successfully.");
            application.status = "Accepted";

            $popupScoped
              .find(".accept-btn")
              .addClass("disabled-button")
              .prop("disabled", true);
            $popupScoped
              .find(".reject-btn")
              .removeClass("disabled-button")
              .prop("disabled", false);
            $popupScoped
              .find(".hold-btn")
              .removeClass("disabled-button")
              .prop("disabled", false);

            $(`.application-card[data-applicant-id="${application.user_id}"]`)
              .find(".status-label")
              .text("Accepted");
            $(`.application-card[data-applicant-id="${application.user_id}"]`)
              .find(".status-dot")
              .removeClass("pending rejected accepted")
              .addClass("accepted");
          } else {
            console.error("Failed to accept application:", data.message);
            alert("Failed to accept application: " + data.message);
          }
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while accepting the application.");
        });
    });

  $popupScoped
    .find("#reject-btn-" + application.application_id)
    .on("click", function () {
      if (application.status !== "Pending") return;
      const formdata = new FormData();
      formdata.append("application_id", application.application_id);
      formdata.append("new_status", "Rejected");
      fetch("/php/update-application-status.php", {
        method: "POST",
        body: formdata,
      })
        .then((Response) => Response.json())
        .then((data) => {
          if (data.success) {
            console.log("Application rejected successfully.");
            application.status = "Rejected";

            $popupScoped
              .find(".reject-btn")
              .addClass("disabled-button")
              .prop("disabled", true);
            $popupScoped
              .find(".accept-btn")
              .removeClass("disabled-button")
              .prop("disabled", false);
            $popupScoped
              .find(".hold-btn")
              .removeClass("disabled-button")
              .prop("disabled", false);

            $(`.application-card[data-applicant-id="${application.user_id}"]`)
              .find(".status-label")
              .text("Rejected");
            $(`.application-card[data-applicant-id="${application.user_id}"]`)
              .find(".status-dot")
              .removeClass("pending rejected accepted")
              .addClass("rejected");
          } else {
            console.error("Failed to reject application:", data.message);
            alert("Failed to reject application: " + data.message);
          }
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred while rejecting the application.");
        });
    });

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

function filterApplications() {
  const selectedStatus = $("#statusFilter").val().toLowerCase();
  $(".application-card").each(function () {
    const status = $(this).find(".status-label").text().toLowerCase();
    if (selectedStatus === "all" || status === selectedStatus) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function sortApplications() {
  const sortOrder = $("#sortOrder").val();
  const applicants = $("#applicants");
  const cards = applicants.children(".application-card").get();

  cards.sort(function (a, b) {
    const dateA = $(a)
      .find(".application-date")
      .text()
      .replace("Applied on: ", "");
    const dateB = $(b)
      .find(".application-date")
      .text()
      .replace("Applied on: ", "");

    const parseDate = (dateStr) => {
      const parts = dateStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    };

    const parsedDateA = parseDate(dateA);
    const parsedDateB = parseDate(dateB);

    if (sortOrder === "newest") {
      return parsedDateB - parsedDateA;
    } else {
      return parsedDateA - parsedDateB;
    }
  });

  $.each(cards, function (index, card) {
    applicants.append(card);
  });
}

function clearFilters() {
  $("#statusFilter").val("all");
  $("#sortOrder").val("newest");
  $(".application-card").show();
  sortApplications();
}
