import { jobListings } from "./data/jobsData.js";

function getRecentJobs() {
  const sorted = [...jobListings].sort(
    (a, b) =>
      new Date(b.datePosted.replace(" ", "T")) -
      new Date(a.datePosted.replace(" ", "T"))
  );
  return sorted.slice(0, 3); // take the recent 3 jobs
}

function renderRecentJobs() {
  const container = document.querySelector(".recent-jobs .job-list");

  const recent = getRecentJobs();
  container.innerHTML = "";

  recent.forEach((job) => {
    const item = document.createElement("div");
    item.className = "job-item";
    item.innerHTML = `
    <h3>${job.title}</h3>
    <p>${job.company}</p>
    <p>${job.location}</p>
    `;
    container.appendChild(item);
  });
}

renderRecentJobs();
