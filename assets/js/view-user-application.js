async function fetchuserapplications() {
  try {
    const response = await fetch("/php/user-applications.php", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      displayApplications(data.applications);
    } else {
      console.error("Failed to fetch applications:", data.message);
      document.getElementById(
        "applications-container"
      ).innerHTML = `<div class="empty-state"><h2>Error</h2><p>${data.message}</p></div>`;
    }
  } catch (error) {
    console.error("Error fetching applications:", error);
    document.getElementById("applications-container").innerHTML =
      '<div class="empty-state"><h2>Error</h2><p>Failed to load applications. Please try again later.</p></div>';
  }
}

function displayApplications(applications) {
  const applicationsContainer = document.getElementById(
    "applications-container"
  );

  if (applications.length === 0) {
    applicationsContainer.innerHTML = `
            <div class="empty-state">
                <h2>No Applications Yet</h2>
                <p>You haven't applied to any jobs yet. Start exploring opportunities!</p>
            </div>
        `;
    return;
  }

  let html = "";
  applications.forEach((app) => {
    const statusClass = app.status
      ? `status-${app.status.toLowerCase()}`
      : "status-pending";
    let companyImage = app.company.image
      ? `/ImageStorage/companies/${app.job.company_id}/${app.company.image}`
      : "/ImageStorage/company.png";
      if(app.company.image == 'company.png'){
        companyImage = "/ImageStorage/company.png";
      }
    const salaryRange =
      app.job.salary_min && app.job.salary_max
        ? `$${app.job.salary_min.toLocaleString()} - $${app.job.salary_max.toLocaleString()}`
        : "Not specified";

    html += `
            <div class="application-card">
                <div class="card-header">
                    <img src="${companyImage}" alt="${
      app.company.company_name
    }" class="company-logo">
                    <div class="job-info">
                        <h3>${app.job.job_title}</h3>
                        <p class="company-name">${app.company.company_name}</p>
                    </div>
                </div>

                 <div class="card-body">
                    <div class="section-title">Your Application Details</div>
                    <div class="info-row">
                        <span class="label">Full Name:</span>
                        <span class="value">${app.full_name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email:</span>
                        <span class="value">${app.email}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Experience Level:</span>
                        <span class="value">${app.experience_level}</span>
                    </div>
                    ${
                      app.cover_letter
                        ? `
                    <div class="info-row-full">
                        <span class="label">Cover Letter:</span>
                        <p class="cover-letter">${app.cover_letter}</p>
                    </div>
                    `
                        : ""
                    }
                    ${
                      app.additional_note
                        ? `
                    <div class="info-row-full">
                        <span class="label">Additional Note:</span>
                        <p class="additional-note">${app.additional_note}</p>
                    </div>
                    `
                        : ""
                    }
                </div>
                
                <div class="card-body">
                    <div class="section-title">Job Details</div>
                    <div class="info-row">
                        <span class="label">Location:</span>
                        <span class="value">${app.job.location}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Category:</span>
                        <span class="value">${app.job.category}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Job Type:</span>
                        <span class="value">${app.job.job_type}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Experience:</span>
                        <span class="value">${app.job.experience}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Salary Range:</span>
                        <span class="value">${salaryRange}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Applied on:</span>
                        <span class="value">${new Date(
                          app.application_date
                        ).toLocaleDateString()}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Status:</span>
                        <span class="status-badge ${statusClass}">${
      app.status || "Pending"
    }</span>
                    </div>
                </div>
                
                <div class="card-footer">
                    <a href="/pages/profile.html?id=${
                      app.job.company_id
                    }&type=company" target="_blank" class="btn-view-company">View Company</a>
                </div>
            </div>
        `;
  });

  applicationsContainer.innerHTML = html;
}

fetchuserapplications();
