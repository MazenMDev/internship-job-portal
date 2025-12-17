//---------------------Genral functions ----------------------
function searchArray(searchQuery, dataArray) {
  if (!searchQuery || searchQuery.trim() === "") {
    return dataArray;
  }

  const query = searchQuery.toLowerCase().trim();

  return dataArray.filter((item) => {
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(query);
    });
  });
}

function addPagination(
  containerSelector,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
) {
  const $container = $(containerSelector);
  if (!$container.length) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (totalPages <= 1) {
    $container.empty();
    return;
  }

  let paginationHtml = '<div class="pagination">';
  if (currentPage > 1) {
    paginationHtml += `<button class="page-btn" data-page="${
      currentPage - 1
    }">Previous</button>`;
  }
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<button class="page-btn ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }
  if (currentPage < totalPages) {
    paginationHtml += `<button class="page-btn" data-page="${
      currentPage + 1
    }">Next</button>`;
  }
  paginationHtml += "</div>";

  $container.html(paginationHtml);
  $container.find(".page-btn").on("click", function () {
    const selectedPage = $(this).data("page");
    onPageChange(selectedPage);
  });
}

//-----------------------------------------------------------
closeSideBar = document.getElementById("closeSideBar");
closeSideBar.addEventListener("click", function () {
  const adminAside = document.getElementById("adminAside");
  if (adminAside.style.display === "none") {
    adminAside.style.display = "block";
    closeSideBar.style.backgroundColor = "var(--box-color)";
    closeSideBar.style.color = "var(--text-color)";
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

    document.getElementById("adminPanel").style.marginLeft = "240px";
  } else {
    closeSideBar.style.backgroundColor = "var(--primary-color)";
    closeSideBar.style.color = "#fff";
    adminAside.style.display = "none";
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

    document.getElementById("adminPanel").style.marginLeft = "0";
  }
});

//---------------------TOTALS----------------------
function handleTotals() {
  $adminName = $("#adminName");
  $totalUsers = $("#totalUsers");
  $totalCompanies = $("#totalCompanies");
  $totalJobs = $("#totalJobs");
  $totalApplications = $("#totalApplications");

  fetch("/php/adminPanel/getTotals.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        document.body.innerHTML = `<h1>${data.error}</h1>`;
        return;
      }
      console.log(data);
      $totalUsers.text(data.total_users);
      $totalCompanies.text(data.total_companies);
      $totalJobs.text(data.total_jobs);
      $totalApplications.text(data.total_applications);
      $adminName.text(data.first_name);
    })
    .catch((error) => console.error("Error fetching totals:", error));
}

//---------------COMPANY VERIFICATIONN--------------------

function handleCompanyVerification() {
  let allCompanies = [];
  let currentPage = 1;
  const itemsPerPage = 9;

  function loadCompanies() {
    const $companyVerificationPanel = $("#CompanyVerification");
    $companyVerificationPanel.html(
      '<div class="loading">Loading companies...</div>'
    );

    fetch("/php/adminPanel/getCompaniesForVerification.php")
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        console.error("Error fetching companies:", error);
        $companyVerificationPanel.html(
          "<h3>Error loading companies. Please try again.</h3>"
        );
      });
  }

  function displayCompanies() {
    const $companyVerificationPanel = $("#CompanyVerification");

    const total = allCompanies.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompanies = allCompanies.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    let htmlContent = `<h2>Pending Company Verifications (${total})</h2>`;

    if (total === 0) {
      htmlContent += '<div class="no-results">No pending companies.</div>';
      $companyVerificationPanel.html(htmlContent);
      return;
    }

    htmlContent += '<div class="company-cards-grid">';
    paginatedCompanies.forEach((company) => {
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
    htmlContent += "</div>";

    htmlContent += '<div id="paginationContainer"></div>';

    $companyVerificationPanel.html(htmlContent);
    addPagination(
      "#paginationContainer",
      total,
      itemsPerPage,
      currentPage,
      function (nextPage) {
        currentPage = nextPage;
        displayCompanies();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    );
    clicksVerif();
  }

  function clicksVerif() {
    $(".verify-company-btn").on("click", function () {
      const companyId = $(this).data("company-id");

      alert(
        sendAcceptanceEmail(
          allCompanies.find((c) => c.verification_id === companyId)
        )
      );
      if (confirm("Verify this company?")) {
        updateCompanyStatus(companyId, 1);
      }
    });

    $(".reject-company-btn").on("click", function () {
      const companyId = $(this).data("company-id");
      alert(
        sendRejectionEmail(
          allCompanies.find((c) => c.verification_id === companyId)
        )
      );
      if (confirm("Reject this company?")) {
        updateCompanyStatus(companyId, 2);
      }
    });
  }

  function updateCompanyStatus(companyId, status) {
    let formData = new FormData();
    formData.append("company_id", companyId);
    formData.append("status", status);
    fetch("/php/adminPanel/updateCompanyStatus.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message || "Status updated successfully");
          loadCompanies();
        } else {
          alert(data.error || "Failed to update status");
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Error updating status. Please try again.");
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

function handleMessages() {
  msgDiv = $(".messages-list");
  let messages = [];
  fetch("/php/adminPanel/getMessages.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        msgDiv.html(`<h3>${data.error}</h3>`);
        return;
      }
      messages = data;

      console.log(messages);
      showMessages(data);
    })
    .catch((error) => console.error("Error fetching messages:", error));

  function showMessages(messagesData) {
    let htmlContent = "";
    if (messages.length === 0) {
      htmlContent = '<div class="no-results">No messages found.</div>';
      msgDiv.html(htmlContent);
    } else {
      const pageSize = 6;
      let currentPage = 1;

      function renderPage(page) {
        currentPage = page;
        htmlContent = "";
        const startIndex = (page - 1) * pageSize;
        const paginatedMessages = messagesData.slice(
          startIndex,
          startIndex + pageSize
        );
        document.getElementById(
          "messagesDiv"
        ).innerText = `Messages (${messagesData.length})`;
        paginatedMessages.forEach((msg) => {
          htmlContent += `
          <div class="message-item">
            <div class="message-header">
            <span class="message-id">Message ID: ${msg.message_id}</span>
            <div class="topRight">
              <span class="message-timestamp">${msg.created_at}</span>
              <div class="delete-message-btn" data-message-id="${msg.message_id}" title="Delete Message">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
            </div>
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

        $(".delete-message-btn").on("click", function () {
          const messageId = $(this).data("message-id");
          if (confirm("Are you sure you want to delete this message?")) {
            deleteMessage(messageId);
          }
        });
      }
      function deleteMessage(messageId) {
        let formData = new FormData();
        formData.append("message_id", messageId);
        fetch("/php/adminPanel/deleteMessage.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message || "Message deleted successfully");
              messagesData = messagesData.filter(
                (msg) => msg.message_id !== messageId
              );
              showMessages(messagesData);
            } else {
              alert(data.error || "Failed to delete message");
            }
          })
          .catch((error) => {
            console.error("Error deleting message:", error);
            alert("Error deleting message. Please try again.");
          });

        addPagination(
          ".messages-pagination",
          messagesData.length,
          pageSize,
          currentPage,
          (nextPage) => {
            renderPage(nextPage);
          }
        );
      }
      renderPage(currentPage);
    }
  }

  $("#Messages .search-input").on("input", function () {
    const query = $(this).val();
    const filteredMessages = searchArray(query, messages);
    showMessages(filteredMessages);
  });
}

//-----------------------USERS TABLE----------------------
function handleUsersTable() {
  const usersPanel = $("#usersPanel");
  const mainDiv = usersPanel.find(".tableContainer");
  const searchInput = usersPanel.find(".search-input");
  let allUsers = [];
  let defaultUsers = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  loadUsers();

  function loadUsers() {
    usersPanel.html('<div class="loading">Loading users...</div>');
    fetch("/php/adminPanel/getAllUsers.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          usersPanel.html(`<h3>${data.error}</h3>`);
          return;
        }
        allUsers = data.users;
        defaultUsers = data.users;
        
        usersPanel.html(`
          <h2 id="usersTitle">Users (${allUsers.length})</h2>
          <input
            type="text"
            class="search-input"
            id="userSearch"
            placeholder="Search users..."
          />
          <div id="usersTableContainer"></div>
        `);
        
        usersPanel.find(".search-input").on("input", function () {
          const query = $(this).val();
          if(!query || query.trim() === ""){
            allUsers = defaultUsers;
            currentPage = 1;
            displayUsers();
            return;
          }
          const filteredUsers = searchArray(query, defaultUsers);
          allUsers = filteredUsers;
          currentPage = 1;
          displayUsers();
        });
        
        displayUsers();
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        usersPanel.html("<h3>Error loading users. Please try again.</h3>");
      });
  }
  function displayUsers() {
    const total = allUsers.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
      if (currentPage > totalPages) currentPage = totalPages;

      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);

      $("#usersTitle").text(`Users (${total})`);

      let htmlContent = "";

      if (total === 0) {
        htmlContent += '<div class="no-results">No users found.</div>';
        $("#usersTableContainer").html(htmlContent);
        return;
      }

      //$stmt = $conn->prepare("SELECT Id, First_Name , Last_Name , Email , Title,  Image , cv , created_at , updated_at FROM users ");
      
      htmlContent += `
      <table class="users-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Image</th>
          <th>Profile</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Title</th>
          <th>CV</th>
          <th>Created At</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      
      <tbody>
      `;
      
      paginatedUsers.forEach((user) => {
        let image_url = '/ImageStorage/profile.jpeg';
        if(user.Image != 'profile.jpeg'){
          image_url = `/ImageStorage/users/${user.Id}/${user.Image}`;
        }
        htmlContent += `
        <tr>
          <td>${user.Id}</td>
          <td><img src="${image_url}" alt="User Image" loading="lazy" class="user-image"></td>
          <td><a href="/pages/profile.html?id=${user.Id}&type=user" class="profile-link" target="_blank">View Profile</a></td>
          <td>${user.First_Name}</td>
          <td>${user.Last_Name}</td>
          <td><a href="mailto:${user.Email}">${user.Email}</a></td>
          <td>${user.Title}</td>
          <td><a href="${user.cv ? `/CVStorage/${user.Id}/${user.cv}` : '#'}" target="_blank">${user.cv ? 'View CV' : 'No CV'}</a></td>
          <td>${user.created_at}</td>
          <td>${user.updated_at}</td>
          <td>
            <button class="delete-user-btn" data-user-id="${user.Id}" title="Delete User">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>
        `
      });

      htmlContent += '</tbody> </table>';
      htmlContent += '<div id="usersPaginationContainer"></div>';

      $("#usersTableContainer").html(htmlContent);
      
      $("#usersTableContainer .delete-user-btn").on("click", function () {
        const userId = $(this).data("user-id");
        if (confirm("Are you sure you want to delete this user?")) {
          deleteUser(userId);
        }
      });

      function deleteUser(userId) {
        let formData = new FormData();
        formData.append("user_id", userId);
        fetch("/php/adminPanel/deleteUser.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert(data.message || "User deleted successfully");
              allUsers = allUsers.filter(
                (user) => user.Id !== userId
              );
              defaultUsers = defaultUsers.filter(
                (user) => user.Id !== userId
              );
              $("#totalUsers").text(defaultUsers.length);
              displayUsers();
            }
            else {
              alert(data.error || "Failed to delete user");
            }
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            alert("Error deleting user. Please try again.");
          });
      }

      
      addPagination(
        "#usersPaginationContainer",
        total,
        itemsPerPage,
        currentPage,
        function (nextPage) {
        currentPage = nextPage;
        displayUsers();
        }
      );
    }

}

$(document).ready(function () {
  handleTotals();
  handleCompanyVerification();
  handleMessages();
  handleUsersTable();
});
