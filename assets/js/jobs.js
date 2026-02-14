//Import the job categories from jobcategories script
import jobCategories from "./jobCategories.js";
import { showJobDetails } from "./jobForm.js";
import { isUserLoggedIn, isCompany } from "./Sessions/notLoggedSession.js";

let currentPage = 1;
document.addEventListener("DOMContentLoaded", function () {
  fetch("/php/getJobs.php")
    .then((response) => response.json())
    .then((data) => {
      //console.log("Fetched Jobs:", data);
      jobListings = data.data || [];
      jobListings.forEach((job) => {
        if (job.logo === "company.png") {
          job.logo = "/ImageStorage/company.png";
        } else {
          job.logo = `/ImageStorage/companies/${job.company_id}/${job.logo}`;
        }
      });
      noFilterArr = jobListings;
      renderPage(currentPage);
      addSalaryFilterJobs();

      // --- Auto-open job details if job_id is in URL ---
      const params = new URLSearchParams(window.location.search);
      const jobIdParam = params.get("job_id");
      if (jobIdParam) {
        const jobToShow = jobListings.find(
          (j) => String(j.job_id) === String(jobIdParam)
        );
        if (jobToShow) {
          showJobDetails(jobToShow);
        }
      }
    })
    .catch((error) => console.error("Error fetching jobs:", error));
});

// put icons for each main category
const categoryIcons = {
  "Technology & IT": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-icon lucide-code"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>`,
  "Design & Creative": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-icon lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>`,
  "Business & Management": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
  "Marketing & Sales": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`,
  "Finance & Accounting": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/></svg>`,
  "Human Resources": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>`,
  Engineering: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-ruler-icon lucide-pencil-ruler"><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
  "Science & Healthcare": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>`,
  "Architecture & Construction": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hard-hat-icon lucide-hard-hat"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></svg>`,
  "Education & Training": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
  "Media & Communication": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-icon lucide-mic"><path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/></svg>`,
  "Law & Legal": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scale-icon lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  "Hospitality & Tourism": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tram-front-icon lucide-tram-front"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>`,
  "Agriculture & Environment": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout-icon lucide-sprout"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>`,
  "Manufacturing & Logistics": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-factory-icon lucide-factory"><path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/></svg>`,
  Other: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-panel-left-icon lucide-layout-panel-left"><rect width="7" height="18" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>`,
};

// dummy jobs until we make the backend
let jobListings = [];

let noFilterArr = jobListings;

const userBookMarks = [];
const selectedCategories = [];

const appliedJobs = [];

$(document).ready(function () {
  fetch("/php/getBookMarkedJobs.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.bookmarked_jobs) {
        userBookMarks.push(...data.bookmarked_jobs);
      }

      //console.log(userBookMarks);

      userBookMarks.forEach((jobId) => {
        const bookmarkIcon = document.querySelector(
          `.bookmark-icon[data-job-id="${jobId}"]`
        );
        if (bookmarkIcon) {
          bookmarkIcon.classList.add("bookmarked");
        }
      });

      showBookmarkedFirst();
    })
    .catch((error) => console.error("Error fetching bookmarked jobs:", error));

  fetch("/php/return-applications.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.applications) {
        const jobIds = data.applications.map((app) => app.job_id);
        appliedJobs.push(...jobIds);
      }
      //console.log("Applied Jobs:", appliedJobs);
      if (isCompany === false && isUserLoggedIn === true) {
        document.getElementById("applied-jobs-count").textContent =
          appliedJobs.length;
        document.getElementById("user-applied-jobs").style.display =
          appliedJobs.length >= 0 ? "block" : "none";
      }
      //console.log(appliedJobs);
      //console.log(isCompany);
      //console.log(isUserLoggedIn);

      renderPage(currentPage);
    })
    .catch((error) => console.error("Error fetching applied jobs:", error));
});

function toggleCategory(cat) {
  const index = selectedCategories.indexOf(cat);
  if (index === -1) {
    selectedCategories.push(cat);
  } else {
    selectedCategories.splice(index, 1);
  }
}
const jobContainer = document.querySelector(".job-container");

//Calculate time since posted
function timeSince(date) {
  // change the new Date format to the sql timestamp format
  // "2023-10-05 14:30:00" to "2023-10-05T14:30:00"
  // then calculate the time since posted
  const postedDate = new Date(date.replace(" ", "T"));
  const currentTime = new Date();
  //subtracting the two dates gives milliseconds time and so we divide it by 1000 to get seconds
  const seconds = Math.floor((currentTime - postedDate) / 1000);

  //put number of seconds of each label to use for the for loop after it
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    if (interval.label === "second") {
      return "just now";
    }

    let count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

//get the parent category of any sub category and if it was parent then store it , and then use it to get the svg to use
function getSVG(category) {
  for (const parent in jobCategories) {
    if (parent === category) {
      return categoryIcons[parent] || categoryIcons["Other"];
    }

    if (jobCategories[parent].includes(category)) {
      return categoryIcons[parent] || categoryIcons["Other"];
    }
  }

  return categoryIcons["Other"];
}

// pages buttons
const jobsPerPage = 6;
const pagesContainer = document.querySelector(".pages");
const prevButton = document.querySelector(".prevP");
const nextButton = document.querySelector(".nextP");

document
  .getElementById("close-filter-button")
  .addEventListener("click", closeFilterBar);
function closeFilterBar() {
  const filterbar = document.querySelector(".job-filter-sidebar");
  filterbar.style.display = "none";
  const parentBlurDiv = document.querySelector(".ParentBlurDiv");
  document.body.removeChild(parentBlurDiv);
}

// show the ammount of job cards per page , and use javascript to dynammically show the jobs instead of the hardcoded html
// REMINDER:: render the last "jobsPerPage" jobs from the backend when its done and when a page button  is clicked render the needed jobs for it
function renderPage(page) {
  window.scrollTo(0, 0);
  jobContainer.innerHTML = "";

  //show the indexes of the jobs being displayed and the current page of total pages
  const totalPages = Math.ceil(jobListings.length / jobsPerPage);
  const startJobNum = (page - 1) * jobsPerPage + 1;
  let endJobNum;
  if (page === totalPages) {
    endJobNum = jobListings.length;
  } else {
    endJobNum = startJobNum + jobsPerPage - 1;
  }

  const jobResult = document.createElement("h1");
  jobResult.textContent = `Showing ${startJobNum}-${endJobNum} of ${jobListings.length} results (Page ${page} of ${totalPages})`;
  jobResult.id = "job-results";
  const jobResultDiv = document.createElement("div");
  jobResultDiv.classList.add("jobResultDiv");

  const filterButton = document.createElement("button");
  filterButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"><path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/></svg>
  `;

  filterButton.addEventListener("click", function () {
    const filterbar = document.querySelector(".job-filter-sidebar");
    filterbar.style.display = "block";
    const parentBlurDiv = document.createElement("div");
    parentBlurDiv.classList.add("ParentBlurDiv");
    document.body.appendChild(parentBlurDiv);
    parentBlurDiv.addEventListener("click", closeFilterBar);
  });

  filterButton.id = "filter-button-mobile";
  jobResultDiv.appendChild(filterButton);
  jobResultDiv.appendChild(jobResult);
  jobContainer.appendChild(jobResultDiv);

  const errorMessage = document.createElement("h2");
  errorMessage.id = "no-jobs-message";
  errorMessage.textContent = "No job listings found.";
  jobContainer.appendChild(errorMessage);

  const start = (page - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  //get and display only the jobs for the current page
  const jobsToDisplay = jobListings.slice(start, end);

  jobsToDisplay.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    jobCard.setAttribute("data-id", job.job_id);
    let applied = false;
    if (appliedJobs.includes(job.job_id)) {
      jobCard.classList.add("applied-job-card");
      applied = true;
    }

    jobCard.innerHTML = `
        <div class="job-date">${timeSince(job.created_at)}</div>
        <svg class="job-bookmark ${
          userBookMarks.includes(job.job_id) ? "bookmarked" : ""
        }" style="${
      !isUserLoggedIn || isCompany ? "display: none !important;" : ""
    }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <div class="job-main-content">
                <div class="company-logo">
                        <img src="${job.logo}" alt="${job.company_name} Logo">
                </div>
                <div class="job-info">
                        <div class="job-header-info">
                                <h3 class="job-title">${job.job_title}</h3>
                                <p class="company-name">${job.company_name}</p>
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
                                          job.job_type
                                        }</span>
                                </div>
                                <div class="job-detail-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </svg>
                                        $${job.salary_min} - $${job.salary_max}
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
                </div>
                <div class="job-action-button" style="${
                  !isUserLoggedIn || isCompany
                    ? "display: none !important;"
                    : ""
                }">
                        <button class="job-form-button${
                          applied ? " applied-job-submit" : ""
                        }">Job Details</button>
                </div>
        </div>
    `;
    jobCard.querySelector(".job-bookmark").addEventListener("click", () => {
      toggleBookmark(job.job_id);
    });

    // Add event listener to job details button
    jobCard.querySelector(".job-form-button").addEventListener("click", () => {
      showJobDetails(job);
    });

    //put the job at the end of the job container
    jobContainer.appendChild(jobCard);
  });
  updatePages();
}

function showError(message) {
  const errorMessage = document.getElementById("no-jobs-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

//add a page button before the next button
function createPageButton(num) {
  const btn = document.createElement("button");
  btn.classList.add("page-btn");
  btn.classList.add("page-btn-num");
  btn.textContent = num;
  if (num === currentPage) btn.classList.add("active");
  btn.addEventListener("click", () => {
    currentPage = num;
    renderPage(currentPage);
  });
  nextButton.before(btn);
}

//create dots when the number of pages isgreater or equal to 4
function createDots() {
  const dots = document.createElement("span");
  dots.textContent = "...";
  dots.classList.add("dots");
  nextButton.before(dots);
}

function updatePages() {
  // remove all existing numbered buttons and dots except Prev and Next
  document.querySelectorAll(".dots").forEach((el) => el.remove());
  document.querySelectorAll(".page-btn-num").forEach((el) => el.remove());

  // Calculate the number of pages
  const totalPages = Math.ceil(jobListings.length / jobsPerPage);

  // hide pages container if only 1 page
  if (totalPages <= 1) {
    pagesContainer.style.display = "none";
    return;
  } else {
    pagesContainer.style.display = "flex";
  }

  // Always show first page
  createPageButton(1);

  // Show dots when the user is on a page greater than 3
  if (currentPage > 3) createDots();

  // find Pages around current page
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    createPageButton(i);
  }

  // Show dots before last page if needed
  if (currentPage < totalPages - 2) createDots();

  // Always show last page
  if (totalPages > 1) createPageButton(totalPages);

  // Enable and disable navigation buttons if the user is on 1st page or last page
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
  if (prevButton.disabled) {
    prevButton.classList.add("disabled");
  } else {
    prevButton.classList.remove("disabled");
  }
  if (nextButton.disabled) {
    nextButton.classList.add("disabled");
  } else {
    nextButton.classList.remove("disabled");
  }

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });
}

function toggleBookmark(jobId) {
  const index = userBookMarks.indexOf(jobId);
  if (index === -1) {
    userBookMarks.push(jobId);
  } else {
    userBookMarks.splice(index, 1);
  }

  const formData = new FormData();
  formData.append("job_id", jobId);
  fetch("/php/bookmarkJob.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const bookmarkIcons = document.querySelectorAll(
    `.job-card[data-id="${jobId}"] .job-bookmark`
  );
  bookmarkIcons.forEach((bookmarkIcon) => {
    bookmarkIcon.classList.toggle("bookmarked", index === -1);
  });
  showBookmarkedFirst();
}

function showBookmarkedFirst() {
  // Get bookmarked jobs in order where they were bookmarked (latest first)
  const bookmarkedJobs = [];
  //i loop through them in reverse to show the latest bookmarked first
  for (let i = userBookMarks.length - 1; i >= 0; i--) {
    const job = jobListings.find((j) => j.job_id === userBookMarks[i]);
    if (job) bookmarkedJobs.push(job);
  }
  // Get non bookmarked jobs
  const nonBookmarkedJobs = jobListings.filter(
    (job) => !userBookMarks.includes(job.job_id)
  );
  // Combine both to the joblisting with latest bookmarked first
  const sortedJobs = [...bookmarkedJobs, ...nonBookmarkedJobs];
  jobListings.length = 0;
  jobListings.push(...sortedJobs);
  renderPage(1);
}

document.addEventListener("DOMContentLoaded", () => {
  displayCategories();
});

//Change the content of the category fitler back to show the parent categories
function resetCategoryFilters() {
  const categoryDropDown = document.querySelector(".category-filter-group");
  categoryDropDown.innerHTML = `
              <summary class="filter-group-legend filter-group-summary">Category</summary>
              `;

  for (const parent in jobCategories) {
    const parentInp = document.createElement("button");
    parentInp.classList.add("parent-category-button");
    parentInp.textContent = parent;

    parentInp.addEventListener("click", () => showSubcategories(parent));
    categoryDropDown.appendChild(parentInp);
  }
}

//when a parent category is clicked , we show all its sub categories
function showSubcategories(parent) {
  //clean the parent string to use as a class
  let parentClass = parent.split(" ").join("");
  parentClass = parentClass.split("&").join("-");

  const categoryDropDown = document.querySelector(".category-filter-group");
  categoryDropDown.innerHTML = `
    <summary class="filter-group-legend filter-group-summary">Category - ${parent}</summary>
  `;

  //loop through the sub categories of the parent and create a checkbox for each one
  for (const cat of jobCategories[parent]) {
    const label = document.createElement("label");
    label.classList.add("filter-option-label");
    label.classList.add(`category-filter-${parentClass}`);

    label.innerHTML = `
    <input type="checkbox" value="${cat}" class="filter-checkbox" /> ${cat}
    `;
    //see if it was checked before to recheck it
    for (const selectedCat of selectedCategories) {
      if (selectedCat === cat) {
        label.querySelector(".filter-checkbox").checked = true;
      }
    }

    //if its checked or un checked we toggle it from the selected categories array
    label.addEventListener("change", function () {
      toggleCategory(cat);
    });
    categoryDropDown.appendChild(label);
  }

  const selectAll = document.createElement("button");
  selectAll.classList.add("selectAllSubLists-button");
  selectAll.textContent = "Select all categories";
  let allSelected = false;
  categoryDropDown.appendChild(selectAll);
  selectAll.addEventListener("click", () => {
    allSelected = !allSelected;
    const labels = document.querySelectorAll(`.category-filter-${parentClass}`);
    labels.forEach(function (label) {
      const inp = label.querySelector(".filter-checkbox");
      inp.checked = allSelected;
      toggleCategory(inp.value);
    });
  });

  const goBackCatBtn = document.createElement("button");
  goBackCatBtn.classList.add("parent-category-button");
  goBackCatBtn.textContent = "← Back to Categories";

  categoryDropDown.appendChild(goBackCatBtn);

  goBackCatBtn.addEventListener("click", () => {
    resetCategoryFilters();
  });
}

const displayCategories = () => {
  const categoryDropDown = document.querySelector(".category-filter-group");
  categoryDropDown.innerHTML = `
              <summary class="filter-group-legend filter-group-summary">Category</summary>
              `;

  for (const parent in jobCategories) {
    const parentInp = document.createElement("button");
    parentInp.classList.add("parent-category-button");
    parentInp.textContent = parent;

    categoryDropDown.appendChild(parentInp);

    parentInp.addEventListener("click", () => showSubcategories(parent));
  }
};

//Logic for double range salary
const sliderTrack = document.querySelector(".slider-track");
const minSlider = document.getElementById("min-slider");
const maxSlider = document.getElementById("max-slider");

const minSalarySpan = document.getElementById("min-salary");
const maxSalarySpan = document.getElementById("max-salary");

const manageSlider = () => {
  let left, width;
  let minDifference = minSlider.value - minSlider.min; // see how much the min slider moved
  let maxDifference = minSlider.max - minSlider.min; // find the total range of the slider
  left = (minDifference / maxDifference) * 100; //get the percentage of the movement

  let sliderDiff = maxSlider.value - minSlider.value; // see how much the difference between the two sliders
  width = (sliderDiff / maxDifference) * 100; // get the percentage of the difference between them

  sliderTrack.style.left = `${left + 2}%`;
  sliderTrack.style.width = `${width - 2}%`;
};
function addSalaryFilterJobs() {
  let max = -1;
  let min = 999999999999;
  jobListings.forEach((job) => {
    const low = job.salary_min;
    const high = job.salary_max;
    if (!isNaN(low) && low < min) min = low;
    if (!isNaN(high) && high > max) max = high;
  });

  minSalarySpan.textContent = `$ ${min}`;
  maxSalarySpan.textContent = `$ ${max}`;

  minSlider.min = min;
  minSlider.max = max;
  minSlider.value = min;

  maxSlider.min = min;
  maxSlider.max = max;
  maxSlider.value = max;
  manageSlider();
  //calculate the differnce to not let the sliders overlap and set it to 10% of the range between them
  let diff = Math.floor((max - min) * 0.1);

  minSlider.addEventListener("input", () => {
    // prevent the min from going after the max by 10% of the distance
    if (parseInt(minSlider.value) >= parseInt(maxSlider.value) - diff) {
      minSlider.value = parseInt(maxSlider.value) - diff;
    }
    minSalarySpan.textContent = `$ ${minSlider.value}`;
    manageSlider();
  });

  maxSlider.addEventListener("input", () => {
    // prevent the max from going before the min by 10% of the distance
    if (parseInt(maxSlider.value) <= parseInt(minSlider.value) + diff) {
      maxSlider.value = parseInt(minSlider.value) + diff;
    }
    maxSalarySpan.textContent = `$ ${maxSlider.value}`;
    manageSlider();
  });
}

const applyButton = document.querySelector(".apply-button");
if (applyButton) {
  applyButton.addEventListener("click", function () {
    applyAllFilters();
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
    applyAllFilters();
  }
});

const resetButtonElement = document.querySelector(".reset-button");
if (resetButtonElement) {
  resetButtonElement.addEventListener("click", function () {
    resetButton();
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    e.preventDefault();
    resetButton();
  }
});

function FilterCategories(jobs) {
  if (selectedCategories.length === 0) {
    return jobs;
  }
  return jobs.filter((job) => selectedCategories.includes(job.category));
}

function removeCatSelections() {
  const categoryFilters = document.querySelectorAll(".filter-checkbox");
  categoryFilters.forEach((catInp) => {
    catInp.checked = false;
  });
  selectedCategories.length = 0;
}

function filterLables(jobs) {
  const labels = document.querySelectorAll(".filter-option-label");
  let filteredJobs = jobs;

  const selectedJobTypes = [];
  const selectedDateFilters = [];

  labels.forEach((label) => {
    const checkbox = label.querySelector(".filter-checkbox");
    if (checkbox && checkbox.checked) {
      if (
        label.parentElement === document.querySelector(".type-filter-group")
      ) {
        selectedJobTypes.push(label.innerText.trim().toLowerCase());
      } else if (
        label.parentElement === document.querySelector(".date-filter-group")
      ) {
        let timeLimit = 0;
        if (checkbox.value === "last-hour") {
          timeLimit = 1 * 60 * 60 * 1000;
        } else if (checkbox.value === "last-24-hours") {
          timeLimit = 24 * 60 * 60 * 1000;
        } else if (checkbox.value === "last-7-days") {
          timeLimit = 7 * 24 * 60 * 60 * 1000;
        } else if (checkbox.value === "last-30-days") {
          timeLimit = 30 * 24 * 60 * 60 * 1000;
        }
        selectedDateFilters.push(timeLimit);
      }
    }
  });

  if (selectedJobTypes.length > 0) {
    filteredJobs = filteredJobs.filter((job) => {
      return selectedJobTypes.includes(job.job_type.toLowerCase());
    });
  }

  if (selectedDateFilters.length > 0) {
    const maxTimeLimit = Math.max(...selectedDateFilters);
    const currentDate = new Date();
    filteredJobs = filteredJobs.filter((job) => {
      const jobDate = new Date(job.created_at.replace(" ", "T"));
      return currentDate - jobDate <= maxTimeLimit;
    });
  }

  return filteredJobs;
}

function filterBySalary(jobs, minSalary, maxSalary) {
  return jobs.filter((job) => {
    return job.salary_min <= maxSalary && job.salary_max >= minSalary;
  });
}

function applyAllFilters() {
  let filteredJobs = [...noFilterArr];

  filteredJobs = inputSearch(filteredJobs);

  filteredJobs = FilterCategories(filteredJobs);

  filteredJobs = filterLables(filteredJobs);

  filteredJobs = filterBySalary(
    filteredJobs,
    parseInt(minSlider.value),
    parseInt(maxSlider.value)
  );

  if (filteredJobs.length === 0) {
    jobListings = [];
    currentPage = 1;
    renderPage(currentPage);
    showError("No jobs found.");
  } else {
    jobListings = filteredJobs;
    currentPage = 1;
    renderPage(currentPage);
  }
}

function resetButton() {
  jobListings = noFilterArr;
  document.querySelector(".search-bar").value = "";
  removeCatSelections();
  currentPage = 1;
  renderPage(currentPage);
}

function resetFilter() {
  jobListings = noFilterArr;
  removeCatSelections();
  const typeAndDateCheckboxes = document.querySelectorAll(
    ".type-filter-group .filter-checkbox, .date-filter-group .filter-checkbox"
  );
  typeAndDateCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  currentPage = 1;
  renderPage(currentPage);
}

function inputSearch(jobs) {
  const searchInput = document.querySelector(".search-bar").value.trim();
  if (searchInput === "") {
    return jobs;
  }
  resetFilter();

  const lowerKeyword = searchInput.toLowerCase();
  return noFilterArr.filter((job) => {
    return (
      job.job_title.toLowerCase().includes(lowerKeyword) ||
      job.location.toLowerCase().includes(lowerKeyword) ||
      job.company_name.toLowerCase().includes(lowerKeyword) ||
      job.category.toLowerCase().includes(lowerKeyword) ||
      job.experience.toLowerCase().includes(lowerKeyword) ||
      job.job_type.toLowerCase().includes(lowerKeyword) ||
      job.tags.some((t) => t.toLowerCase().includes(lowerKeyword)) ||
      job.skills.some((s) => s.toLowerCase().includes(lowerKeyword))
    );
  });
}

export { jobListings, getSVG, timeSince, toggleBookmark, userBookMarks };
