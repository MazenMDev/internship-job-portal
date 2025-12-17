 async function fetchuserapplications()  {
    
    try{
     const response = await fetch('/php/user-applications.php', {
         method: 'GET'
    });
    const data = await response.json();

    if(data.success) {
        /*
        Example data:{
            "application_id": 1,
            "user_id": 1,
            "job_id": 1,
            "full_name": "Kareem Hassan",
            "email": "kareem99710@gmail.com",
            "resume": "",
            "experience_level": "mid-level",
            "additional_note": "qweqweqwe",
            "cover_letter": "Hello , im testing job application",
            "application_date": "2025-12-13 16:16:39",
            "status": "Accepted",
            "job": {
                "job_id": 1,
                "company_id": 1,
                "job_title": "Test Job Posting",
                "job_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel aliquam tellus, sit amet porttitor quam. Cras eu erat sed ipsum laoreet tincidunt. Mauris commodo tincidunt turpis, ut ullamcorper ex sollicitudin sed. Nulla varius mattis orci, quis blandit nisl dapibus eu. Cras quam elit, auctor eget enim et, euismod elementum risus. Nam odio sem, pharetra nec tincidunt vitae, rhoncus nec sapien. Integer sem ex, pellentesque id libero ut, volutpat pharetra lacus. Vestibulum et lacinia massa. Morbi ornare nisi at placerat egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas sagittis vehicula nisi eu tempor. In non ligula metus. Praesent faucibus, nibh eu bibendum sodales, lorem odio consectetur tellus, vel vulputate quam leo eu quam.\r\n\r\nAliquam erat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget pulvinar magna. Cras vitae nisi eu sem vestibulum commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut sit amet nisi vulputate nisl fringilla ultricies. Nulla viverra ornare massa a rhoncus. Praesent consequat, quam nec porta mollis, ligula neque consequat nibh, sed ultricies nibh augue in ex. Curabitur feugiat risus vel mi vulputate, tincidunt volutpat purus maximus. Ut vitae nisl eu quam fermentum imperdiet eu in metus. Aliquam sed lectus leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin id semper erat.",
                "location": "Fisal, Egypt",
                "category": "Software Development",
                "experience": "No Experience",
                "job_type": "part-time",
                "is_deleted": 0,
                "salary_min": 10000,
                "salary_max": 20000,
                "created_at": "2025-12-13 16:12:14"
            },
            "company": {
                "company_name": "Job Connect Test Account",
                "company_email": "JobConnect@gmail.com",
                "company_url": "http://localhost:3000/pages/profile.html?id=1#",
                "image": "profile_1765650072.png"
            }
        }
            console.log(data.applications);
        */

        displayApplications(data.applications);
    } else {
        console.error('Failed to fetch applications:', data.message);
        alert('Error fetching applications: ' + data.message);
    }
    } catch (error) {
        console.error('Error fetching applications:', error);
    }

    function displayApplications(applications) {
        const applicationsContainer = document.getElementById("applications-container");

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

        applicationsContainer.innerHTML = html;
       

    }
    
}
fetchuserapplications();

