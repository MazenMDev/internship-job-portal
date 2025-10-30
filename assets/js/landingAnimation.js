const steps = document.querySelectorAll(".step");
window.addEventListener("scroll", check);
function check() {
  checkJobs();
  checkSteps();
}
function checkJobs() {
  const triggerBottom = (window.innerHeight / 5) * 4;
  const jobs = document.querySelectorAll(".job-item");
  jobs.forEach((job) => {
    const jobTop = job.getBoundingClientRect().top;
    if (jobTop < triggerBottom) {
      job.classList.add("show");
    } else {
      job.classList.remove("show");
    }
  });
}
function checkSteps() {
  const triggerBottom = (window.innerHeight / 5) * 4;
  steps.forEach((step) => {
    const stepTop = step.getBoundingClientRect().top;
    if (stepTop < triggerBottom) {
      step.classList.add("show");
    } else {
      step.classList.remove("show");
    }
  });
}
