 async function fetchuserapplications()  {
    
    try{
     const response = await fetch('../api/user-applications.php', {
         method: 'GET',
         credentials: 'include',
    });
    const data = await response.json();

    if(data.success) {
        displayApplications(data.applications);
    } else {
        console.error('Failed to fetch applications:', data.message);
        alert('Error fetching applications: ' + data.message);
    }
    } catch (error) {
        console.error('Error fetching applications:', error);
    }

    function displayApplications(applications) {
        const applicationsContainer = document.getElementById('applications-container');

        if (applications.length === 0) {
            applicationsContainer.innerHTML = '<p>You have not applied to any jobs.</p>';
            return;
        }

        let html='';
        applications.forEach(app => {
            html += `
            <div class="application-card">
                <h3>job id:${app.job.job_id}</h3>
                <p>Status: ${app.status}</p>
                <p>Applied on: ${app.applied_date}</p>
            </div>
            `;

        });

        Container.innerHTML = html;
       

    }
    fetchuserapplications();

 }