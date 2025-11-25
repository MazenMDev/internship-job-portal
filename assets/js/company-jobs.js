
let userData = null;
async function fetchUserData() {
  const response = await fetch("../php/company_data.php");
  const data = await response.json();
  userData = data;
  return data;
}

let maxTags = 7,
  currentTags = 0;
let maxSkills = 20,
  currentSkills = 0;
import jobCategories from "./jobCategories.js";
import {showJobDetails} from "./jobForm.js";
let companyData;
await fetchUserData();
if (userData && userData.company_name) {
  fetch("../php/get-company-jobs.php")
  .then((result)=>{
    return result.json()
  }
)
.then((data)=>{
  companyData = data;
  addCompanyData(data);
  jobCardListeners();
})
.catch((error)=>{
  console.log(error)
})

  document.getElementById("post-job-button").addEventListener("click", () => {
    const popup = document.createElement("div");
    popup.classList.add("popup-form-company");
    popup.innerHTML = `
    <div class="container-company-popup">
    <span id="close-btn-company">&times;</span>
    <div class="top">
        <h3 class="section-title">Post a job</h3>
      </div>
      <div class="bottom-row">
        <div class="bottom-right">
          <div class="bottom-up">
            <div class="up-right">
              <div class="form-group">
              <label for="job">Job Title</label>
              <input type="text" placeholder="Enter job title" id="job" maxlength="100" class="input-box">
            </div>
            <div class="form-group">
              <label for="salary">Salary</label>
              <input type="text" placeholder="12000-16000" maxlength="20" id="salary" class="input-box">
            </div>

            </div>
            <div class="up-left">
               <div class="form-group">
              <label for="skills">Experience</label>
              <input type="text" placeholder="Enter experience" maxlength="50" id="experience" class="input-box">
            </div>
            <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" maxlength="100" class="input-box" placeholder="Enter company location">
          </div>
            </div>
          </div>
          <div class="bottom-down">
            <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="input-box large" placeholder="Write a description about the company"></textarea>
            <p class="char-count" id="descCharCount">max: 0/2000</p>
            </div>
          </div>
        </div>
        <div class="bottom-left">
          <aside class="job-time-cat-container">
            <fieldset class="job-type">
                <h2 class="Options-title">Job-type</h2>
                <select class="option-group">
                    <option value="part-time">Part-Time</option>
                    <option value="full-time">Full-Time</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                </select>
            </fieldset>
            <fieldset class="job-categories">
                <select class="option-group" id="categoryDropdown"></select>
            </fieldset>
            <div class="form-group">
              <label for="tags">Tags</label>
              <div class="requiredtag tag-div">
                <div class="tag-disp">
                </div>
                <button id="addtag">>></button>
              </div>
            </div>
            <div class="form-group">
              <label for="skills">Required Skills</label>
              <div class="requiredSkills skills-div">
                <div class="skills-disp">
                </div>
                <button id="addSkill">>></button>
              </div>
            </div>
            <p class="error-message" id="jobErrorMessage"></p>
            <button id="addJobSubmit" class="add-button">Add Job</button>
        </aside>
        </div>
      </div>
    </div>
    `;
    document.body.appendChild(popup);
    document.querySelector(
      ".input-box#location"
    ).value = `${userData.city}, ${userData.country}`;
    document.querySelector(
      ".input-box#description"
    ).placeholder = `${userData.company_name} is a company based in ${userData.city}, ${userData.country}. We are looking to hire talented individuals to join our team.`;
    document
      .querySelector(".input-box#description")
      .addEventListener("input", function () {
        const charCount = document.getElementById("descCharCount");
        charCount.textContent = `max: ${this.value.length}/2000`;
        if (
          document.querySelector(".input-box#description").value.length > 1999
        ) {
          document.querySelector(".input-box#description").value = document
            .querySelector(".input-box#description")
            .value.slice(0, 1999);
        }
      });

    document.body.classList.add("open-company-popup");
    document
      .getElementById("blurred-background")
      .addEventListener("click", () => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
        document.body.classList.remove("open-company-popup");
      });

    document
      .getElementById("close-btn-company")
      .addEventListener("click", () => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
        document.body.classList.remove("open-company-popup");
      });

    const jobcat = document.getElementById("categoryDropdown");

    for (let parent in jobCategories) {
      const parentOptgroup = document.createElement("optgroup");
      parentOptgroup.label = parent;
      parentOptgroup.classList.add("optgroup-category");
      for (let jobCategory of jobCategories[parent]) {
        const childoption = document.createElement("option");
        childoption.value = jobCategory;
        childoption.textContent = jobCategory;
        childoption.classList.add("option-category");
        parentOptgroup.appendChild(childoption);
      }
      jobcat.appendChild(parentOptgroup);
    }

    /*
<select> 
  <optgroup label="PARENT CATEGORY">
    <option value="CHILD CATEGORY">CHILD CATEGORY</option>
  </optgroup>
</select>
*/

    document.getElementById("addSkill").addEventListener("click", function (e) {
      e.preventDefault();
      if (currentSkills >= maxSkills) {
        return;
      }

      const container = document.querySelector(".skills-disp");

      const skillDiv = document.createElement("div");
      skillDiv.className = "skill";
      skillDiv.contentEditable = "true"; // make it editable when user add ti
      skillDiv.setAttribute("data-editing", "true");
      skillDiv.textContent = "";

      container.appendChild(skillDiv);
      skillDiv.focus();
      currentSkills++;

      if (currentSkills >= maxSkills) {
        document.getElementById("addSkill").disabled = true;
      } else {
        document.getElementById("addSkill").disabled = false;
      }

      function finishEditing() {
        skillDiv.removeAttribute("data-editing");
        skillDiv.contentEditable = "false";

        if (!skillDiv.textContent.trim()) {
          skillDiv.remove();
          currentSkills--;
          
          if (currentSkills >= maxSkills) {
            document.getElementById("addSkill").disabled = true;
          } else {
            document.getElementById("addSkill").disabled = false;
          }
        } else {
          skillDiv.textContent = skillDiv.textContent.trim();
        }
      }

      skillDiv.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          finishEditing();
          skillDiv.blur();
        } else if (ev.key === "Escape") {
          skillDiv.remove();
          currentSkills--;
          
          if (currentSkills >= maxSkills) {
            document.getElementById("addSkill").disabled = true;
          } else {
            document.getElementById("addSkill").disabled = false;
          }
        }
      });

      // If the user leaves the div then keep it in the form
      skillDiv.addEventListener("blur", function () {
        if (skillDiv.getAttribute("data-editing")) {
          finishEditing();
        }
      });

      // remove a skill when clcicked
      skillDiv.addEventListener("click", function () {
        if (skillDiv.contentEditable === "false") {
          skillDiv.remove();
          currentSkills--;
          
          // Update button state after removal
          if (currentSkills >= maxSkills) {
            document.getElementById("addSkill").disabled = true;
          } else {
            document.getElementById("addSkill").disabled = false;
          }
        }
      });
    });

    document.getElementById("addtag").addEventListener("click", function (e) {
      e.preventDefault();
      if (currentTags >= maxTags) {
        return;
      }
      const container = document.querySelector(".tag-disp");

      const tagDiv = document.createElement("div"); // consistently lowercase
      tagDiv.className = "tag";
      tagDiv.contentEditable = "true";
      tagDiv.setAttribute("data-editing", "true");
      tagDiv.textContent = "";

      container.appendChild(tagDiv);
      tagDiv.focus();
      currentTags++;

      // Update button state
      if (currentTags >= maxTags) {
        document.getElementById("addtag").disabled = true;
      } else {
        document.getElementById("addtag").disabled = false;
      }

      function finishEditing() {
        tagDiv.removeAttribute("data-editing");
        tagDiv.contentEditable = "false";

        if (!tagDiv.textContent.trim()) {
          tagDiv.remove();
          currentTags--;
          
          if (currentTags >= maxTags) {
            document.getElementById("addtag").disabled = true;
          } else {
            document.getElementById("addtag").disabled = false;
          }
        } else {
          tagDiv.textContent = tagDiv.textContent.trim();
        }
      }

      tagDiv.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          finishEditing();
          tagDiv.blur();
        } else if (ev.key === "Escape") {
          tagDiv.remove();
          currentTags--;
          
          if (currentTags >= maxTags) {
            document.getElementById("addtag").disabled = true;
          } else {
            document.getElementById("addtag").disabled = false;
          }
        }
      });

      tagDiv.addEventListener("blur", function () {
        if (tagDiv.getAttribute("data-editing")) {
          finishEditing();
        }
      });

      tagDiv.addEventListener("click", function () {
        if (tagDiv.contentEditable === "false") {
          tagDiv.remove();
          currentTags--;
          
          if (currentTags >= maxTags) {
            document.getElementById("addtag").disabled = true;
          } else {
            document.getElementById("addtag").disabled = false;
          }
        }
      });
    });
    document.getElementById("addJobSubmit").addEventListener("click", () => {
      const errorMessageEl = document.getElementById("jobErrorMessage");
      //collect data and send to server
      const title = document.querySelector(".input-box#job").value.trim();
      if (title.length === 0) {
        errorMessageEl.textContent = "Job title cannot be empty.";
        return;
      }

      const salary = document.querySelector(".input-box#salary").value.trim();
      if (salary.length === 0) {
        errorMessageEl.textContent = "Salary cannot be empty.";
        return;
      }
      // salary format: 12000-16000 (allow optional spaces)
      const salaryPattern = /^\d{1,7}\s*-\s*\d{1,7}/;
      if (!salaryPattern.test(salary)) {
        errorMessageEl.textContent = "Salary must be in format: ex:12000-16000";
        return;
      }

      const [minStr, maxStr] = salary.split("-").map((s) => s.trim());
      const minSalary = parseInt(minStr, 10);
      const maxSalary = parseInt(maxStr, 10);

      if (Number.isNaN(minSalary) || Number.isNaN(maxSalary)) {
        errorMessageEl.textContent = "Invalid salary numbers.";
        return;
      }

      if (minSalary > maxSalary) {
        errorMessageEl.textContent =
          "Minimum salary cannot be greater than maximum salary.";
        return;
      }
      const experience = document
        .querySelector(".input-box#experience")
        .value.trim();
      if (experience.length === 0) {
        errorMessageEl.textContent = "Experience cannot be empty.";
        return;
      }
      const location = document
        .querySelector(".input-box#location")
        .value.trim();
      if (location.length === 0) {
        errorMessageEl.textContent = "Location cannot be empty.";
        return;
      }

      const description = document
        .querySelector(".input-box#description")
        .value.trim();
      if (description.length === 0) {
        errorMessageEl.textContent = "Description cannot be empty.";
        return;
      }
      const jobType = document.querySelector(".job-type .option-group").value;
      const category = document.querySelector(
        ".job-categories .option-group"
      ).value;

      const skillElements = document.querySelectorAll(".skills-disp .skill");
      let skills = Array.from(skillElements).map((el) => {
        return el.textContent.trim();
      });
      skills = skills.filter((s) => {
        return s.length > 0;
      });
      const tagElements = document.querySelectorAll(".tag-disp .tag");
      let tags = Array.from(tagElements).map((el) => {
        return el.textContent.trim();
      });
      tags = tags.filter((s) => {
        return s.length > 0;
      });
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('salary_min', minSalary);
      formData.append('salary_max', maxSalary);
      formData.append('experience', experience);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('jobType', jobType);
      formData.append('category', category);
      formData.append('skills', JSON.stringify(skills));
      formData.append('tags', JSON.stringify(tags));

      const submitBtn = document.getElementById("addJobSubmit");
      submitBtn.disabled = true;
      errorMessageEl.style.color = "orange";
      errorMessageEl.textContent = "Loading...";

      fetch("../php/post_job.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
        errorMessageEl.textContent = "";
        errorMessageEl.style.color = "red";
        submitBtn.disabled = false;
        window.location.reload();
          } else {
        errorMessageEl.style.color = "red";
        errorMessageEl.textContent = data.message || "Error posting job.";
        submitBtn.disabled = false;
          }
        })
        .catch((err) => {
          errorMessageEl.style.color = "red";
          errorMessageEl.textContent =
        "Network error while posting job. Please try again.";
          submitBtn.disabled = false;
          console.error(err);
        });
    });
  });

  const companyNameEl = document.querySelector(".companyName");
  if (companyNameEl) companyNameEl.textContent = userData.company_name;

  document.getElementById("company-job").style.display = "block";
  
} else {
  const companyJobEl = document.getElementById("company-job");
  if (companyJobEl) companyJobEl.style.display = "none";
}


function addCompanyData(data){
  let countActiveJobs = 0;
  data.forEach((job) => {
    if(job.is_deleted == 0){
      countActiveJobs++;
    }
  });
  document.getElementById("active-listings").textContent = countActiveJobs;
  document.getElementById("applications-received").textContent = "0";

  const companyJobsContainer = document.querySelector(".company-posted-grid");
  data.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("posted-job");
    jobDiv.setAttribute("data-job-id", job.job_id);
    let activeClass , statusText;
    if(job.is_deleted == 1){
      activeClass = "";
      statusText = "Inactive";
    } else {
      activeClass = "active";
      statusText = "Active";
    }
    jobDiv.innerHTML = `
      <div class="svg-job-background"></div>
                <span class="company-job-title">${job.job_title}</span>
                <div class="job-status-container">
                  <div class="status-indicator ${activeClass}"></div>
                  <span class="job-status">${statusText}</span>
                </div>
                <span class="applicant-count">0 Applicants</span>
                <svg
                  class="manage-company-form"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
    `;
    jobDiv.addEventListener("click", (e) => {
      window.location.href = `job-application-view.html?jobId=${job.job_id}`;
    });
    companyJobsContainer.appendChild(jobDiv);
  });

}

function jobCardListeners(){
    const svgBackgrounds = [
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 800 800'><rect fill='#330033' width='800' height='800'/><g fill='none' stroke='#404'  stroke-width='1'><path d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/><path d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/><path d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/><path d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/><path d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/></g><g  fill='#505'><circle  cx='769' cy='229' r='5'/><circle  cx='539' cy='269' r='5'/><circle  cx='603' cy='493' r='5'/><circle  cx='731' cy='737' r='5'/><circle  cx='520' cy='660' r='5'/><circle  cx='309' cy='538' r='5'/><circle  cx='295' cy='764' r='5'/><circle  cx='40' cy='599' r='5'/><circle  cx='102' cy='382' r='5'/><circle  cx='127' cy='80' r='5'/><circle  cx='370' cy='105' r='5'/><circle  cx='578' cy='42' r='5'/><circle  cx='237' cy='261' r='5'/><circle  cx='390' cy='382' r='5'/></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 1080 900'><rect fill='#1AD9FF' width='1080' height='900'/><g fill-opacity='.1'><polygon fill='#444' points='90 150 0 300 180 300'/><polygon points='90 150 180 0 0 0'/><polygon fill='#AAA' points='270 150 360 0 180 0'/><polygon fill='#DDD' points='450 150 360 300 540 300'/><polygon fill='#999' points='450 150 540 0 360 0'/><polygon points='630 150 540 300 720 300'/><polygon fill='#DDD' points='630 150 720 0 540 0'/><polygon fill='#444' points='810 150 720 300 900 300'/><polygon fill='#FFF' points='810 150 900 0 720 0'/><polygon fill='#DDD' points='990 150 900 300 1080 300'/><polygon fill='#444' points='990 150 1080 0 900 0'/><polygon fill='#DDD' points='90 450 0 600 180 600'/><polygon points='90 450 180 300 0 300'/><polygon fill='#666' points='270 450 180 600 360 600'/><polygon fill='#AAA' points='270 450 360 300 180 300'/><polygon fill='#DDD' points='450 450 360 600 540 600'/><polygon fill='#999' points='450 450 540 300 360 300'/><polygon fill='#999' points='630 450 540 600 720 600'/><polygon fill='#FFF' points='630 450 720 300 540 300'/><polygon points='810 450 720 600 900 600'/><polygon fill='#DDD' points='810 450 900 300 720 300'/><polygon fill='#AAA' points='990 450 900 600 1080 600'/><polygon fill='#444' points='990 450 1080 300 900 300'/><polygon fill='#222' points='90 750 0 900 180 900'/><polygon points='270 750 180 900 360 900'/><polygon fill='#DDD' points='270 750 360 600 180 600'/><polygon points='450 750 540 600 360 600'/><polygon points='630 750 540 900 720 900'/><polygon fill='#444' points='630 750 720 600 540 600'/><polygon fill='#AAA' points='810 750 720 900 900 900'/><polygon fill='#666' points='810 750 900 600 720 600'/><polygon fill='#999' points='990 750 900 900 1080 900'/><polygon fill='#999' points='180 0 90 150 270 150'/><polygon fill='#444' points='360 0 270 150 450 150'/><polygon fill='#FFF' points='540 0 450 150 630 150'/><polygon points='900 0 810 150 990 150'/><polygon fill='#222' points='0 300 -90 450 90 450'/><polygon fill='#FFF' points='0 300 90 150 -90 150'/><polygon fill='#FFF' points='180 300 90 450 270 450'/><polygon fill='#666' points='180 300 270 150 90 150'/><polygon fill='#222' points='360 300 270 450 450 450'/><polygon fill='#FFF' points='360 300 450 150 270 150'/><polygon fill='#444' points='540 300 450 450 630 450'/><polygon fill='#222' points='540 300 630 150 450 150'/><polygon fill='#AAA' points='720 300 630 450 810 450'/><polygon fill='#666' points='720 300 810 150 630 150'/><polygon fill='#FFF' points='900 300 810 450 990 450'/><polygon fill='#999' points='900 300 990 150 810 150'/><polygon points='0 600 -90 750 90 750'/><polygon fill='#666' points='0 600 90 450 -90 450'/><polygon fill='#AAA' points='180 600 90 750 270 750'/><polygon fill='#444' points='180 600 270 450 90 450'/><polygon fill='#444' points='360 600 270 750 450 750'/><polygon fill='#999' points='360 600 450 450 270 450'/><polygon fill='#666' points='540 600 630 450 450 450'/><polygon fill='#222' points='720 600 630 750 810 750'/><polygon fill='#FFF' points='900 600 810 750 990 750'/><polygon fill='#222' points='900 600 990 450 810 450'/><polygon fill='#DDD' points='0 900 90 750 -90 750'/><polygon fill='#444' points='180 900 270 750 90 750'/><polygon fill='#FFF' points='360 900 450 750 270 750'/><polygon fill='#AAA' points='540 900 630 750 450 750'/><polygon fill='#FFF' points='720 900 810 750 630 750'/><polygon fill='#222' points='900 900 990 750 810 750'/><polygon fill='#222' points='1080 300 990 450 1170 450'/><polygon fill='#FFF' points='1080 300 1170 150 990 150'/><polygon points='1080 600 990 750 1170 750'/><polygon fill='#666' points='1080 600 1170 450 990 450'/><polygon fill='#DDD' points='1080 900 1170 750 990 750'/></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' ><defs><linearGradient id='a' x1='0' x2='0' y1='0' y2='1'><stop offset='0'  stop-color='#17C5FF'/><stop offset='1'  stop-color='#0D62FF'/></linearGradient></defs><pattern id='b'  width='24' height='24' patternUnits='userSpaceOnUse'><circle  fill='#ffffff' cx='12' cy='12' r='12'/></pattern><rect width='100%' height='100%' fill='url(#a)'/><rect width='100%' height='100%' fill='url(#b)' fill-opacity='0.1'/></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 200 200'><rect fill='#487346' width='200' height='200'/><g fill-opacity='1'><polygon  fill='#4c8e43' points='100 57.1 64 93.1 71.5 100.6 100 72.1'/><polygon  fill='#6aac5f' points='100 57.1 100 72.1 128.6 100.6 136.1 93.1'/><polygon  fill='#4c8e43' points='100 163.2 100 178.2 170.7 107.5 170.8 92.4'/><polygon  fill='#6aac5f' points='100 163.2 29.2 92.5 29.2 107.5 100 178.2'/><path  fill='#89CC7C' d='M100 21.8L29.2 92.5l70.7 70.7l70.7-70.7L100 21.8z M100 127.9L64.6 92.5L100 57.1l35.4 35.4L100 127.9z'/><polygon  fill='#768c3a' points='0 157.1 0 172.1 28.6 200.6 36.1 193.1'/><polygon  fill='#96ac58' points='70.7 200 70.8 192.4 63.2 200'/><polygon  fill='#B6CC76' points='27.8 200 63.2 200 70.7 192.5 0 121.8 0 157.2 35.3 192.5'/><polygon  fill='#96ac58' points='200 157.1 164 193.1 171.5 200.6 200 172.1'/><polygon  fill='#768c3a' points='136.7 200 129.2 192.5 129.2 200'/><polygon  fill='#B6CC76' points='172.1 200 164.6 192.5 200 157.1 200 157.2 200 121.8 200 121.8 129.2 192.5 136.7 200'/><polygon  fill='#768c3a' points='129.2 0 129.2 7.5 200 78.2 200 63.2 136.7 0'/><polygon  fill='#B6CC76' points='200 27.8 200 27.9 172.1 0 136.7 0 200 63.2 200 63.2'/><polygon  fill='#96ac58' points='63.2 0 0 63.2 0 78.2 70.7 7.5 70.7 0'/><polygon  fill='#B6CC76' points='0 63.2 63.2 0 27.8 0 0 27.8'/></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 1600 800'><rect fill='#000000' width='1600' height='800'/><g fill-opacity='1'><polygon  fill='#222222' points='800 100 0 200 0 800 1600 800 1600 200'/><polygon  fill='#444444' points='800 200 0 400 0 800 1600 800 1600 400'/><polygon  fill='#666666' points='800 300 0 600 0 800 1600 800 1600 600'/><polygon  fill='#888888' points='1600 800 800 400 0 800'/><polygon  fill='#aaaaaa' points='1280 800 800 500 320 800'/><polygon  fill='#cccccc' points='533.3 800 1066.7 800 800 600'/><polygon  fill='#EEE' points='684.1 800 914.3 800 800 700'/></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 1600 900'><rect fill='#ff7700' width='1600' height='900'/><polygon fill='#cc0000'  points='957 450 539 900 1396 900'/><polygon fill='#aa0000'  points='957 450 872.9 900 1396 900'/><polygon fill='#d6002b'  points='-60 900 398 662 816 900'/><polygon fill='#b10022'  points='337 900 398 662 816 900'/><polygon fill='#d9004b'  points='1203 546 1552 900 876 900'/><polygon fill='#b2003d'  points='1203 546 1552 900 1162 900'/><polygon fill='#d3006c'  points='641 695 886 900 367 900'/><polygon fill='#ac0057'  points='587 900 641 695 886 900'/><polygon fill='#c4008c'  points='1710 900 1401 632 1096 900'/><polygon fill='#9e0071'  points='1710 900 1401 632 1365 900'/><polygon fill='#aa00aa'  points='1210 900 971 687 725 900'/><polygon fill='#880088'  points='943 900 1210 900 971 687'/></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 2000 1500'><rect fill='#000000' width='2000' height='1500'/><defs><circle  stroke='#D60' vector-effect='non-scaling-stroke' id='a' fill='none' stroke-width='5' r='315'/><use id='f' href='#a' stroke-dasharray='100 100 100 9999'/><use id='b' href='#a' stroke-dasharray='250 250 250 250 250 9999'/><use id='e' href='#a' stroke-dasharray='1000 500 1000 500 9999'/><use id='g' href='#a' stroke-dasharray='1500 9999'/><use id='h' href='#a' stroke-dasharray='2000 500 500 9999'/><use id='j' href='#a' stroke-dasharray='800 800 800 800 800 9999'/><use id='k' href='#a' stroke-dasharray='1200 1200 1200 1200 1200 9999'/><use id='l' href='#a' stroke-dasharray='1600 1600 1600 1600 1600 9999'/></defs><g transform='translate(1000 750)' stroke-opacity='1'><g  transform='rotate(0 0 0)' ><circle  fill='#D60' fill-opacity='1' r='10'/><g  transform='rotate(0 0 0)'><use href='#f' transform='scale(.1) rotate(50 0 0)' /><use href='#f' transform='scale(.2) rotate(100 0 0)' /><use href='#f' transform='scale(.3) rotate(150 0 0)' /></g><g  transform='rotate(0 0 0)'><use href='#b' transform='scale(.4) rotate(200 0 0)' /><use href='#z' transform='scale(.5) rotate(250 0 0)' /></g><g  id='z' transform='rotate(0 0 0)'><g  transform='rotate(0 0 0)'><use href='#b'/><use href='#b' transform='scale(1.2) rotate(90 0 0)' /><use href='#b' transform='scale(1.4) rotate(60 0 0)' /><use href='#e' transform='scale(1.6) rotate(120 0 0)' /><use href='#e' transform='scale(1.8) rotate(30 0 0)' /></g></g><g  id='y' transform='rotate(0 0 0)'><g  transform='rotate(0 0 0)'><use href='#e' transform='scale(1.1) rotate(20 0 0)' /><use href='#g' transform='scale(1.3) rotate(-40 0 0)' /><use href='#g' transform='scale(1.5) rotate(60 0 0)' /><use href='#h' transform='scale(1.7) rotate(-80 0 0)' /><use href='#j' transform='scale(1.9) rotate(100 0 0)' /></g></g><g  transform='rotate(0 0 0)'><g  transform='rotate(0 0 0)'><g  transform='rotate(0 0 0)'><use href='#h' transform='scale(2) rotate(60 0 0)'/><use href='#j' transform='scale(2.1) rotate(120 0 0)'/><use href='#j' transform='scale(2.3) rotate(180 0 0)'/><use href='#h' transform='scale(2.4) rotate(240 0 0)'/><use href='#j' transform='scale(2.5) rotate(300 0 0)'/></g><use href='#y' transform='scale(2) rotate(180 0 0)' /><use href='#j' transform='scale(2.7)'/><use href='#j' transform='scale(2.8) rotate(45 0 0)'/><use href='#j' transform='scale(2.9) rotate(90 0 0)'/><use href='#k' transform='scale(3.1) rotate(135 0 0)'/><use href='#k' transform='scale(3.2) rotate(180 0 0)'/></g><use href='#k' transform='scale(3.3) rotate(225 0 0)'/><use href='#k' transform='scale(3.5) rotate(270 0 0)'/><use href='#k' transform='scale(3.6) rotate(315 0 0)'/><use href='#k' transform='scale(3.7)'/><use href='#k' transform='scale(3.9) rotate(75 0 0)'/></g></g></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 1000 1000'><rect fill='#ffff99' width='1000' height='1000'/><g  fill='#ffd573'><polygon points='1000 -50 0 -50 500 450'/><polygon points='550 500 1050 1000 1050 0'/><polygon points='-50 0 -50 1000 450 500'/><polygon points='0 1050 1000 1050 500 550'/></g><g  fill='#ffaa4d'><polygon points='1000 -133.3 0 -133.3 500 366.7'/><polygon points='633.3 500 1133.3 1000 1133.3 0'/><polygon points='-133.3 0 -133.3 1000 366.7 500'/><polygon points='0 1133.3 1000 1133.3 500 633.3'/></g><g  fill='#ff8026'><polygon points='1000 -216.7 0 -216.7 500 283.3'/><polygon points='716.7 500 1216.7 1000 1216.7 0'/><polygon points='-216.7 0 -216.7 1000 283.3 500'/><polygon points='0 1216.7 1000 1216.7 500 716.7'/></g><g  fill='#F50'><polygon points='1000 -300 0 -300 500 200'/><polygon points='800 500 1300 1000 1300 0'/><polygon points='-300 0 -300 1000 200 500'/><polygon points='0 1300 1000 1300 500 800'/></g><g fill-opacity='0.5'><polygon  fill='#FE0' points='0 707.1 0 292.9 292.9 0 707.1 0 1000 292.9 1000 707.1 707.1 1000 292.9 1000'/><g  fill='#ffc800'><polygon points='464.6 -242.5 -242.5 464.6 464.6 464.6'/><polygon points='535.4 464.6 1242.5 464.6 535.4 -242.5'/><polygon points='-242.5 535.4 464.6 1242.5 464.6 535.4'/><polygon points='535.4 1242.5 1242.5 535.4 535.4 535.4'/></g><g  fill='#ffa200'><polygon points='405.7 -301.4 -301.4 405.7 405.7 405.7'/><polygon points='594.3 405.7 1301.4 405.7 594.3 -301.4'/><polygon points='-301.4 594.3 405.7 1301.4 405.7 594.3'/><polygon points='594.3 1301.4 1301.4 594.3 594.3 594.3'/></g><g  fill='#ff7b00'><polygon points='346.8 -360.3 -360.3 346.8 346.8 346.8'/><polygon points='653.2 346.8 1360.3 346.8 653.2 -360.3'/><polygon points='-360.3 653.2 346.8 1360.3 346.8 653.2'/><polygon points='653.2 1360.3 1360.3 653.2 653.2 653.2'/></g><g  fill='#F50'><polygon points='287.9 -419.2 -419.2 287.9 287.9 287.9'/><polygon points='712.1 287.9 1419.2 287.9 712.1 -419.2'/><polygon points='-419.2 712.1 287.9 1419.2 287.9 712.1'/><polygon points='712.1 1419.2 1419.2 712.1 712.1 712.1'/></g></g></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' width='100%' height='100%' viewBox='0 0 1600 800'><rect fill='#000000' width='1600' height='800'/><g fill-opacity='1'><polygon  fill='#220000' points='1600 160 0 460 0 350 1600 50'/><polygon  fill='#440000' points='1600 260 0 560 0 450 1600 150'/><polygon  fill='#660000' points='1600 360 0 660 0 550 1600 250'/><polygon  fill='#880000' points='1600 460 0 760 0 650 1600 350'/><polygon  fill='#A00' points='1600 800 0 800 0 750 1600 450'/></g></svg>`,
  ];

  const postedJobs = document.querySelectorAll(".posted-job");
  postedJobs.forEach((job) => {
    //add svg based on job id
    const index = job.getAttribute("data-job-id") % svgBackgrounds.length;
    const svgElement = job.querySelector(".svg-job-background");
    svgElement.innerHTML = svgBackgrounds[index];


    //add click event to open job Settings
    const manageFormBtn = job.querySelector(".manage-company-form");
    manageFormBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const jobId = job.getAttribute("data-job-id");
      const div = document.createElement("div");
      div.classList.add("manage-job-form-overlay");
      div.innerHTML = `
      <div class="close-overlay-btn">&times;</div>
        <div class="manage-job-overlay">
          <h2>Manage Job</h2>
          <button class="toggle-activation-btn"  id ="toggle-activation-btn-${jobId}" data-job-id="${jobId}">Activate/Deactivate Job</button>
          <button class="view-form-btn" id="view-form-btn-company-${jobId}" data-job-id="${jobId}">View Form</button>
        </div>
        `;
      const $div = $(div).hide().appendTo(job).fadeIn(200);
      const $overlay = $div.find(".manage-job-overlay");
      const btn = document.getElementById(`view-form-btn-company-${jobId}`); 
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-job-id");
        const job = companyData.find((j) => j.job_id == jobId);
       
        // attach company info to the job before opening the form
        const profileImg = document.querySelector(".profile-nav-img");
        Object.assign(job, {
            company_name: userData?.company_name || "",
            company_id: userData?.user_id || "",
            logo: profileImg ? profileImg.src : "",
            website: userData?.company_url || "",
            salary: `$${job.salary_min}-${job.salary_max}`
          });

        showJobDetails(job);
      });

      const toggleBtn = document.getElementById(`toggle-activation-btn-${jobId}`);
      toggleBtn.addEventListener("click", function () {
        const jobId = this.getAttribute("data-job-id");
        const formData = new FormData();
        formData.append('job_id', jobId);
        fetch("../php/toggle-job-activity.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              window.location.reload();
            } else if (data.error) {
              console.error("Error:", data.error);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        })

      $overlay.hide().slideDown(200);

      // close when clicking the close button
      $div.on("click", ".close-overlay-btn", function () {
        $overlay.slideUp(200, function () {
          $div.fadeOut(200, function () {
            $div.remove();
          });
        });
      });

      $(document).on("click", function (e) {
          $overlay.slideUp(200, function () {
            $div.fadeOut(200, function () {
              $div.remove();
            });
          });
      });
    });
  });

 

  document.querySelectorAll(".posted-job").forEach((job) => {
    job.addEventListener("click", () => {
    
    });
  });
}
