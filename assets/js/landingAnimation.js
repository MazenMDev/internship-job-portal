const steps = document.querySelectorAll(".step");
window.addEventListener("scroll", check);
window.addEventListener("load", check); // ensure initial state on page load
function check() {
  checkJobs();
  checkSteps();
  checkBenefits();
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

function checkBenefits() {
  const triggerBottom = (window.innerHeight / 5) * 4;
  const benefits = document.querySelectorAll(".benefit-item");
  benefits.forEach((card) => {
    const top = card.getBoundingClientRect().top;
    if (top < triggerBottom) {
      card.classList.add("show");
    } else {
      card.classList.remove("show");
    }
  });
}
