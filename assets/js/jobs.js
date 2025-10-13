//Import the job categories from jobcategories script
import jobCategories from "./jobCategories.js";

// put icons for each main category
const categoryIcons = {
  "Technology & IT": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-icon lucide-code"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>`,
  "Design & Creative": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paintbrush-icon lucide-paintbrush"><path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/></svg>`,
  "Business & Management": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-handshake-icon lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>`,
  "Marketing & Sales": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-dollar-sign-icon lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`,
  "Finance & Accounting": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/></svg>`,
  "Human Resources": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>`,
  "Engineering" : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-ruler-icon lucide-pencil-ruler"><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
  "Science & Healthcare": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>`,
  "Architecture & Construction": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hard-hat-icon lucide-hard-hat"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></svg>`,
  "Education & Training": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
  "Media & Communication": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-icon lucide-mic"><path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/></svg>`,
  "Law & Legal": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scale-icon lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  "Hospitality & Tourism": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tram-front-icon lucide-tram-front"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>`,
  "Agriculture & Environment": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout-icon lucide-sprout"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>`,
  "Manufacturing & Logistics": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-factory-icon lucide-factory"><path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/></svg>`,
  "Other": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-panel-left-icon lucide-layout-panel-left"><rect width="7" height="18" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>`,
};

// dummy jobs until we make the backend
const jobListings = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Google",
    category: "Software Development",
    type: "Full time",
    salary: "$24000-$32000",
    location: "Cairo, EG",
    experience: "2-4 years",
    datePosted: "2025-10-10 20:00:00",
    logo: "../assets/imgs/dummyJobCompanyImages/google-company.jpg",
  },

  {
    id: 2,
    title: "Marketing Specialist",
    company: "Coca-Cola",
    category: "Marketing & Sales",
    type: "Full time",
    salary: "$28000-$35000",
    experience: "3-5 years",
    location: "Atlanta, GA",
    datePosted: "2025-10-08 09:20:00",
    logo: "../assets/imgs/dummyJobCompanyImages/cocacola.jpg",
  },
  {
    id: 3,
    title: "Cloud Engineer",
    company: "Amazon",
    category: "Cloud Computing",
    type: "Full time",
    salary: "$130000-$190000",
    experience: "6+ years",
    location: "Smart Village, Giza",
    datePosted: "2025-10-06 11:55:00",
    logo: "../assets/imgs/dummyJobCompanyImages/amazon.jpeg",
  },
  {
    id: 4,
    title: "Registered Nurse",
    company: "Mayo Clinic",
    category: "Science & Healthcare",
    type: "Full time",
    salary: "$55000-$75000",
    experience: "2+ years",
    location: "Rochester, MN",
    datePosted: "2025-10-07 08:45:00",
    logo: "../assets/imgs/dummyJobCompanyImages/mayo-clinic.jpeg",
  },
  {
    id: 5,
    title: "Accountant",
    company: "PwC",
    category: "Accounting",
    type: "Full time",
    salary: "$40000-$60000",
    experience: "2-3 years",
    location: "London, UK",
    datePosted: "2025-10-04 12:00:00",
    logo: "../assets/imgs/dummyJobCompanyImages/pwc.jpg",
  },
  {
    id: 6,
    title: "Civil Engineer",
    company: "Bechtel",
    category: "Architecture",
    type: "Full time",
    salary: "$70000-$90000",
    experience: "5+ years",
    location: "Houston, TX",
    datePosted: "2025-10-03 09:30:00",
    logo: "../assets/imgs/dummyJobCompanyImages/bechtel.png",
  },
  {
    id: 7,
    title: "Biology Teacher",
    company: "Springfield High School",
    category: "Teaching & Tutoring",
    type: "Full time",
    salary: "$35000-$48000",
    experience: "3+ years",
    location: "Springfield, IL",
    datePosted: "2025-10-02 08:15:00",
    logo: "../assets/imgs/dummyJobCompanyImages/springfield.jpeg",
  },
  {
    id: 8,
    title: "IOS Developer",
    company: "Apple",
    category: "Mobile App Development",
    type: "Full time",
    salary: "$34000-$45000",
    experience: "4-6 years",
    location: "Cupertino, CA",
    datePosted: "2025-10-05 14:18:00",
    logo: "../assets/imgs/dummyJobCompanyImages/apple.jpeg",
  },
];



const userBookMarks = [];


const jobContainer = document.querySelector(".job-container");

//Calculate time since posted
function timeSince(date) {
  // change the new Date format to the sql timestamp format
  // "2023-10-05 14:30:00" to "2023-10-05T14:30:00"
  // then calculate the time since posted
  const postedDate = new Date(date.replace(" ", "T"));
  const currentTime = new Date();
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

    if (
      Array.isArray(jobCategories[parent]) &&
      jobCategories[parent].includes(category)
    ) {
      return categoryIcons[parent] || categoryIcons["Other"];
    }
  }

  return categoryIcons["Other"];
}

// pages buttons
const jobsPerPage = 6;
let currentPage = 1;
const totalPages = Math.ceil(jobListings.length / jobsPerPage);
const pagesContainer = document.querySelector(".pages");
const prevButton = document.querySelector(".prevP");
const nextButton = document.querySelector(".nextP");

// show the ammount of job cards per page , and use javascript to dynammically show the jobs instead of the hardcoded html
// REMINDER:: render the last "jobsPerPage" jobs from the backend when its done and when a page button  is clicked render the needed jobs for it
function renderPage(page) {
  jobContainer.innerHTML = "";

  //show the indexes of the jobs being displayed and the current page of total pages
  const startJobNum = (page - 1) * jobsPerPage + 1;
  const endJobNum = Math.min(page * jobsPerPage, jobListings.length);
  const jobResult = document.createElement("h1");
  jobResult.textContent = `Showing ${startJobNum}-${endJobNum} of ${jobListings.length} results (Page ${page} of ${totalPages})`;
  jobResult.id = "job-results";
  jobContainer.appendChild(jobResult);

  const start = (page - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  //get and display only the jobs for the current page
  const jobsToDisplay = jobListings.slice(start, end);
  jobsToDisplay.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    jobCard.setAttribute("data-id", job.id);
    jobCard.innerHTML = `
        <div class="job-date">${timeSince(job.datePosted)}</div>
        <svg class="job-bookmark ${userBookMarks.includes(job.id) ? "bookmarked" : ""}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <div class="job-main-content">
                <div class="company-logo">
                        <img src="${job.logo}" alt="${job.company} Logo">
                </div>
                <div class="job-info">
                        <div class="job-header-info">
                                <h3 class="job-title">${job.title}</h3>
                                <p class="company-name">${job.company}</p>
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
                </div>
                <div class="job-action-button">
                        <button class="job-form-button">Job Details</button>
                </div>
        </div>
    `;
    jobCard.querySelector(".job-bookmark").addEventListener("click", () => {
        toggleBookmark(job.id);
    });
    //put the job at the end of the job container
    jobContainer.appendChild(jobCard);
  });
  updatePages();
}

//add a page button before the next button
function createPageButton(num) {
  const btn = document.createElement("button");
  btn.classList.add("page-btn");
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
  document
    .querySelectorAll(".page-btn:not(.prevP):not(.nextP), .dots")
    .forEach((el) => el.remove());

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

renderPage(currentPage);

//search
function searchJobs(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  const filteredJobs = jobListings.filter((job) => {
    return (
      job.title.toLowerCase().includes(lowerKeyword) ||
      job.location.toLowerCase().includes(lowerKeyword) ||
      job.company.toLowerCase().includes(lowerKeyword) ||
      job.category.toLowerCase().includes(lowerKeyword) ||
      job.experience.toLowerCase().includes(lowerKeyword) ||
      job.location.toLowerCase().includes(lowerKeyword) ||
      job.salary.toLowerCase().includes(lowerKeyword)
    );
  });
  return filteredJobs;
}


function toggleBookmark(jobId) {

  const index = userBookMarks.indexOf(jobId);
  //search the userBookMarks array for the job id 
  //and if its found (means that its already bookmarked) we remove the class of bookmarked and remove it from the bookmarked class
  // else if its not found we add the class of bookmarked and add it to the bookmarked array
  if (index === -1) {
    userBookMarks.push(jobId);
  } else {
    userBookMarks.splice(index, 1);
  }
  const bookmarkIcon = document.querySelector(`.job-card[data-id="${jobId}"] .job-bookmark`);
  if (bookmarkIcon) {
    bookmarkIcon.classList.toggle("bookmarked", index === -1);
    
  }
  showBookmarkedFirst();
}


function showBookmarkedFirst() {
  // Get bookmarked jobs in order where they were bookmarked (latest first)
  const bookmarkedJobs = [];
  //i loop through them in reverse to show the latest bookmarked first
  for (let i = userBookMarks.length - 1; i >= 0; i--) {
    const job = jobListings.find(j => j.id === userBookMarks[i]);
    if (job) bookmarkedJobs.push(job);
  }
  // Get non bookmarked jobs
  const nonBookmarkedJobs = jobListings.filter(job => !userBookMarks.includes(job.id));
  // Combine both to the joblisting with latest bookmarked first
  const sortedJobs = [...bookmarkedJobs, ...nonBookmarkedJobs];
  jobListings.length = 0;
  jobListings.push(...sortedJobs);
  renderPage(1);
}

export { jobListings };