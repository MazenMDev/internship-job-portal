//---------------------Genral functions ----------------------
function searchArray(searchQuery, dataArray) {
    if (!searchQuery || searchQuery.trim() === '') {
        return dataArray;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return dataArray.filter(item => {
        return Object.values(item).some(value => {
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(query);
        });
    });
}

function addPagification(containerSelector, totalItems, itemsPerPage, currentPage, onPageChange) {
    const $container = $(containerSelector);
    if (!$container.length) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (totalPages <= 1) { $container.empty(); return; }

    let paginationHtml = '<div class="pagination">';
    if (currentPage > 1) {
        paginationHtml += `<button class="page-btn" data-page="${currentPage - 1}">Previous</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    if (currentPage < totalPages) {
        paginationHtml += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
    }
    paginationHtml += '</div>';

    $container.html(paginationHtml);
    $container.find('.page-btn').on('click', function() {
        const selectedPage = $(this).data('page');
        onPageChange(selectedPage);
    });
}


//-----------------------------------------------------------
closeSideBar = document.getElementById('closeSideBar');
closeSideBar.addEventListener('click', function() {
    const adminAside = document.getElementById('adminAside');
    if (adminAside.style.display === 'none') {
        adminAside.style.display = 'block';
        closeSideBar.style.backgroundColor = 'var(--box-color)';
        closeSideBar.style.color = 'var(--text-color)';
        closeSideBar.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-x-icon lucide-x"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>`;

      document.getElementById('adminPanel').style.marginLeft = '240px';
    } else {
        closeSideBar.style.backgroundColor = 'var(--primary-color)';
        closeSideBar.style.color = '#fff';
        adminAside.style.display = 'none';
        closeSideBar.innerHTML = `    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-menu-icon lucide-menu"
    >
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>`;
    
      document.getElementById('adminPanel').style.marginLeft = '0';
    }
});

//---------------------TOTALS----------------------
function handleTotals(){
    $totalUsers = $('#totalUsers');
    $totalCompanies = $('#totalCompanies');
    $totalJobs = $('#totalJobs');
    $totalApplications = $('#totalApplications');

    fetch('/php/adminPanel/getTotals.php').then(response => response.json()).then(data => {
      if (data.error) {
        document.body.innerHTML = `<h1>${data.error}</h1>`;
        return;
      }  
      console.log(data);
      $totalUsers.text(data.total_users);
        $totalCompanies.text(data.total_companies);
        $totalJobs.text(data.total_jobs);
        $totalApplications.text(data.total_applications);
    }).catch(error => console.error('Error fetching totals:', error));
}

//---------------COMPANY VERIFICATIONN--------------------

function handleCompanyVerification(){
  
    let allCompanies = [];
    let currentPage = 1;
    const itemsPerPage = 9;

    function loadCompanies() {
        const $companyVerificationPanel = $('#CompanyVerification');
        $companyVerificationPanel.html('<div class="loading">Loading companies...</div>');

        fetch('/php/adminPanel/getCompaniesForVerification.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    $companyVerificationPanel.html(`<h3>${data.error}</h3>`);
                    return;
                }

                allCompanies = data;
                /*console.log(data)
                {
    "verification_id": 1,
    "is_verified": 0,
    "company_name": "testing_COMPANY_verif",
    "company_email": "Test@gmail.com",
    "password": "$2y$10$SRsvBbals0uiknMBWemc6uleM4yggEIYZXWhR6P5rNXa2yM9rCLQ.",
    "company_phone": "01211125898",
    "company_city": "Fisal",
    "company_state": "fa",
    "company_zip": "aaa",
    "company_country": "Egyptaaa",
    "company_website": "https://github.com/khaledcodeo-man",
    "verification_code": "",
    "created_at": "2025-12-15 20:44:24",
    "company_address": "asdasda"
}
                */
                displayCompanies();
            })
            .catch(error => {
                console.error('Error fetching companies:', error);
                $companyVerificationPanel.html('<h3>Error loading companies. Please try again.</h3>');
            });
    }

    function displayCompanies() {
        const $companyVerificationPanel = $('#CompanyVerification');

        const total = allCompanies.length;
        const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedCompanies = allCompanies.slice(startIndex, startIndex + itemsPerPage);

        let htmlContent = `<h2>Pending Company Verifications (${total})</h2>`;

        if (total === 0) {
            htmlContent += '<div class="no-results">No pending companies.</div>';
            $companyVerificationPanel.html(htmlContent);
            return;
        }

        htmlContent += '<div class="company-cards-grid">';
        paginatedCompanies.forEach(company => {
            htmlContent += `
                <div class="company-verification-card">
                  <div class="company-verif-cont">
                    <h3>${company.company_name}</h3>
                    <div id="verification-container">
                      <div class="company-verif-status pending"></div>
                      <div class="company-verif-status-text">Pending</div>
                    </div>
                  </div>

                  <p><strong>Email:</strong> ${company.company_email}</p>
                  <p><strong>Phone:</strong> ${company.company_phone}</p>
                  <p><strong>City:</strong> ${company.company_city}</p>
                  <p><strong>State:</strong> ${company.company_state}</p>
                  <p><strong>Country:</strong> ${company.company_country}</p>
                  <p><strong>Website:</strong> <a href="${company.company_website}" target="_blank">${company.company_website}</a></p>
                  <div class="company-verif-actions">
                    <button class="verify-company-btn" data-company-id="${company.verification_id}">Verify</button>
                    <button class="reject-company-btn" data-company-id="${company.verification_id}">Reject</button>
                  </div>
                </div>`;
        });
        htmlContent += '</div>';

        htmlContent += '<div id="paginationContainer"></div>';

        $companyVerificationPanel.html(htmlContent);
        addPagification('#paginationContainer', total, itemsPerPage, currentPage, function(nextPage){
            currentPage = nextPage;
            displayCompanies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        clicksVerif();
    }

    function clicksVerif() {
        $('.verify-company-btn').on('click', function() {
            const companyId = $(this).data('company-id');
            
            alert(sendAcceptanceEmail(allCompanies.find(c => c.verification_id === companyId)));
            if (confirm('Verify this company?')) {
                updateCompanyStatus(companyId, 1);
            }
        });

        $('.reject-company-btn').on('click', function() {
            const companyId = $(this).data('company-id');
            alert(sendRejectionEmail(allCompanies.find(c => c.verification_id === companyId)));
            if (confirm('Reject this company?')) {
                updateCompanyStatus(companyId, 2);
            }
        });
    }

    function updateCompanyStatus(companyId, status) {
        let formData = new FormData();
        formData.append('company_id', companyId);
        formData.append('status', status);
        fetch('/php/adminPanel/updateCompanyStatus.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message || 'Status updated successfully');
                loadCompanies();
            } else {
                alert(data.error || 'Failed to update status');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        });
    }

    loadCompanies();



    function sendRejectionEmail(company_data) {
      const emailTemplate = `
    Subject: Company Verification Rejected

    Dear ${company_data.company_name},

    We regret to inform you that your company verification request has been rejected on our Job Portal.

    If you believe this is an error, please contact our support team for further assistance.

    Best regards,
    Job Portal Admin Team
      `.trim();

      return `Copy the email template below and send it to ${company_data.company_email}:\n\n'  ${emailTemplate} '\n\nClick OK after sending the email.`;
  
      
    }

    function sendAcceptanceEmail(company_data) {
      const emailTemplate = `
    Subject: Company Verification Approved
    Dear ${company_data.company_name},

    Congratulations! Your company verification request has been approved on our Job Portal. You can now log in and start posting job listings.

    If you have any questions or need assistance, feel free to reach out to our support team.
    Best regards,
    Job Portal Admin Team
      `.trim();
      return `Copy the email template below and send it to ${company_data.company_email}:\n\n' ${emailTemplate} '\n\nClick OK after sending the email.`;
      
      
    }
  
}

//-----------------------MESSAGES----------------------

function handleMessages(){
  msgDiv = $('.messages-list');
  let messages = [];
  fetch('/php/adminPanel/getMessages.php').then(response => response.json()).then(data => {
      if (data.error) {
        msgDiv.html(`<h3>${data.error}</h3>`);
        return;
      }
      messages = data;
      
    console.log(messages)
      showMessages(data);
  }
  ).catch(error => console.error('Error fetching messages:', error));

  function showMessages(messagesData){
    let htmlContent = '';
    if(messages.length === 0){
      htmlContent = '<div class="no-results">No messages found.</div>';
      msgDiv.html(htmlContent);
    }
    else{
      const pageSize = 6;
      let currentPage = 1;

      function renderPage(page) {
        currentPage = page;
        htmlContent = '';
        const startIndex = (page - 1) * pageSize;
        const paginatedMessages = messagesData.slice(startIndex, startIndex + pageSize);
        document.getElementById('messagesDiv').innerText = `Messages (${messagesData.length})`;
        paginatedMessages.forEach(msg => {
          htmlContent += `
          <div class="message-item">
            <div class="message-header">
            <span class="message-id">Message ID: ${msg.message_id}</span>
            <span class="message-timestamp">${msg.created_at}</span>
            </div>
            <h4 class="message-name">
            <span class="fname">${msg.first_name}</span> <span class="lname">${msg.last_name}</span>
          </h4>
          <a href="mailto:${msg.email}" class="message-email">${msg.email}</a>
          <h5>Message:</h5>
          <div class="message-content">
            <p>${msg.message}</p>
          </div>
          </div>`;
        });
        htmlContent += '<div class="messages-pagination"></div>';
        msgDiv.html(htmlContent);
        
        addPagification('.messages-pagination', messagesData.length, pageSize, currentPage, (nextPage) => {
          renderPage(nextPage);
        });
      }
      renderPage(currentPage);
    }
  }

  $('#Messages .search-input').on('input', function() {
    const query = $(this).val();
    const filteredMessages = searchArray(query, messages);
    showMessages(filteredMessages);
  });
}



$(document).ready(function() {
    
    handleTotals();
    handleCompanyVerification();
    handleMessages();

});

