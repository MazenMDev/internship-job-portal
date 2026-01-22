//---------------------Genral functions ----------------------
function searchArray(searchQuery, dataArray) {
  if (!searchQuery || searchQuery.trim() === "") {
    return dataArray;
  }

  //change the input to lower case to be able to search the whole array (lower case and uppercase)
  const query = searchQuery.toLowerCase().trim();

  //loop through each item in the array and get its value , then see if it includes the search
  const filteredArray = dataArray.filter((item) => {
    for (let val in item) {
      const value = item[val];
      if (value !== null && value !== undefined) {
        const valueString = String(value).toLowerCase();
        if (valueString.includes(query)) {
          return true;
        }
      }
    }
    return false;
  });

  return filteredArray;
}

function addPagination(
  containerSelector,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange // a callback function
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
      /*
        console.log(data);
        {
          "total_users": 4,
          "total_companies": 6,
          "total_jobs": 5,
          "total_applications": 4,
          "first_name": "Kareem"
        }
      */
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
        /*
        console.log(data)
        {
          "verification_id": 1,
          "is_verified": 0,
          "company_name": "testing_COMPANY_verif",
          "company_email": "Test@gmail.com",
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

  function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.className = 'admin-loading-overlay';
    overlay.id = 'adminLoadingOverlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">${message}</div>
    `;
    document.body.appendChild(overlay);
  }

  function hideLoadingOverlay() {
    const overlay = document.getElementById('adminLoadingOverlay');
    if (overlay) {
      overlay.remove();
    }
  }

  function clicksVerif() {
    $(".verify-company-btn").on("click", function () {
      const companyId = $(this).data("company-id");
      const $btn = $(this);
      const originalText = $btn.text();

      if (confirm("Verify this company?")) {
        $(".verify-company-btn, .reject-company-btn").prop("disabled", true);
        $btn.addClass("loading");
        $btn.data("original-text", originalText);
        $btn.html('<span class="btn-spinner"></span>');
        showLoadingOverlay("Verifying company...");
        updateCompanyStatus(companyId, 1);
      }
    });

    $(".reject-company-btn").on("click", function () {
      const companyId = $(this).data("company-id");
      const $btn = $(this);
      const originalText = $btn.text();

      if (confirm("Reject this company?")) {
        $(".verify-company-btn, .reject-company-btn").prop("disabled", true);
        $btn.addClass("loading");
        $btn.data("original-text", originalText);
        $btn.html('<span class="btn-spinner"></span>');
        showLoadingOverlay("Rejecting company...");
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
        hideLoadingOverlay();
        if (data.success) {
          alert(data.message || "Status updated successfully");
          loadCompanies();
        } else {
          alert(data.error || "Failed to update status");
          // Re-enable buttons on error and restore text
          $(".verify-company-btn, .reject-company-btn").each(function() {
            const $b = $(this);
            $b.prop("disabled", false).removeClass("loading");
            if ($b.data("original-text")) {
              $b.text($b.data("original-text"));
            }
          });
        }
      })
      .catch((error) => {
        hideLoadingOverlay();
        console.error("Error updating status:", error);
        alert("Error updating status. Please try again.");
        $(".verify-company-btn, .reject-company-btn").each(function() {
          const $b = $(this);
          $b.prop("disabled", false).removeClass("loading");
          if ($b.data("original-text")) {
            $b.text($b.data("original-text"));
          }
        });
      });
  }

  loadCompanies();

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
      /*
        console.log(messages);
        [
          {
              "message_id": 8,
              "email": "kareem99710@gmail.com",
              "message": "aaa",
              "created_at": "2025-12-20 17:58:15",
              "user_Id": 1,
              "first_name": "Kareem",
              "last_name": "Ahmed",
              "company_id": null
          },
          {
              "message_id": 7,
              "email": "kareem99710@gmail.com",
              "message": "aaa",
              "created_at": "2025-12-20 17:54:53",
              "user_Id": null,
              "first_name": "Kareem",
              "last_name": "Ahmed",
              "company_id": 1
          }
        ]
      */
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
              <div class="delete-message-btn" data-message-id="${
                msg.message_id
              }" title="Delete Message">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
            </div>
            </div>
            <h4 class="message-name">
            <span class="fname">${msg.first_name}</span> <span class="lname">${
            msg.last_name
          }</span>
          </h4>
          <a href="mailto:${msg.email}" class="message-email">${msg.email}</a>
          <div class="userAccount">
            <strong>Account Type:</strong> ${
              msg.user_Id ? "User" : msg.company_id ? "Company" : "Guest"
            }<br/>
            <strong>Account ID:</strong> ${
              msg.user_Id
                ? msg.user_Id
                : msg.company_id
                ? msg.company_id
                : "N/A"
            }
            <h3 style="display:${
              msg.user_Id || msg.company_id ? "block" : "none"
            }" class="msg_logged_profile">View <a href="/pages/profile.html?id=${
            msg.user_Id ? msg.user_Id : msg.company_id ? msg.company_id : ""
          }&type=${
            msg.user_Id ? "user" : msg.company_id ? "company" : ""
          }">Profile</a></h3>

          </div>
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
        /*
          console.log(data);
          {
              "success": true,
              "users": [
                  {
                      "Id": 1,
                      "First_Name": "Kareem",
                      "Last_Name": "Ahmed",
                      "Email": "admin@gmail.com",
                      "Title": "Student at MSA University",
                      "Image": "profile_1766308011.jpg",
                      "cv": "Course Registeration System.pdf",
                      "created_at": "2025-11-13 13:54:02",
                      "updated_at": "2025-12-21 11:06:51"
                  },
                  {
                      "Id": 2,
                      "First_Name": "Test",
                      "Last_Name": "Account",
                      "Email": "t@gmail.com",
                      "Title": null,
                      "Image": "profile_1766308114.jpg",
                      "cv": null,
                      "created_at": "2025-11-15 13:41:33",
                      "updated_at": "2025-12-21 11:08:35"
                  }
              ]
          }
        */
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
          if (!query || query.trim() === "") {
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
    const paginatedUsers = allUsers.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    $("#usersTitle").text(`Users (${total})`);

    let htmlContent = "";

    if (total === 0) {
      htmlContent += '<div class="no-results">No users found.</div>';
      $("#usersTableContainer").html(htmlContent);
      return;
    }

    //$stmt = $conn->prepare("SELECT Id, First_Name , Last_Name , Email , Title,  Image , cv , created_at , updated_at FROM users ");

    htmlContent += `
      <div class="users-table-wrapper">
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
      let image_url = "/ImageStorage/profile.jpeg";
      if (user.Image != "profile.jpeg") {
        image_url = `/ImageStorage/users/${user.Id}/${user.Image}`;
      }
      htmlContent += `
        <tr>
          <td>${user.Id}</td>
          <td><img src="${image_url}" alt="User Image" loading="lazy" class="user-image"></td>
          <td><a href="/pages/profile.html?id=${
            user.Id
          }&type=user" class="profile-link" target="_blank">View Profile</a></td>
          <td>${user.First_Name}</td>
          <td>${user.Last_Name}</td>
          <td><a href="mailto:${user.Email}">${user.Email}</a></td>
          <td>${user.Title}</td>
          <td><a href="${
            user.cv ? `/CVStorage/${user.Id}/${user.cv}` : "#"
          }" target="_blank">${user.cv ? "View CV" : "No CV"}</a></td>
          <td>${user.created_at}</td>
          <td>${user.updated_at}</td>
          <td>
            <button class="delete-user-btn" data-user-id="${
              user.Id
            }" title="Delete User">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>
        `;
    });

    htmlContent += "</tbody> </table></div>";
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
            allUsers = allUsers.filter((user) => user.Id !== userId);
            defaultUsers = defaultUsers.filter((user) => user.Id !== userId);
            $("#totalUsers").text(defaultUsers.length);
            displayUsers();
          } else {
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

//-----------------------COMPANY TABLE----------------------
function handleCompaniesTable() {
  let allCompanies = [];
  let defaultCompanies = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  loadCompanies();

  function loadCompanies() {
    $("#companiesPanel").html(
      '<div class="loading">Loading companies...</div>'
    );
    fetch("/php/adminPanel/getAllCompanies.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          $("#companiesPanel").html(`<h3>${data.error}</h3>`);
          return;
        }
        /*
          console.log(data);
          {
              "companies": [
            {
                  {
                      "company_id": 4,
                      "company_name": "Google",
                      "phone_number": "+1 650-253-0000",
                      "street_address": "1600 Amphitheatre Parkway",
                      "city": "Mountain View",
                      "state": "California",
                      "zip_code": "94043",
                      "country": "USA",
                      "company_url": "https://careers.google.com",
                      "created_at": "2025-12-21 11:16:29",
                      "Image": "profile_1766308783.jpg",
                      "total_jobs": 1,
                      "total_applications": 0
                  },
                  {
                      "company_id": 5,
                      "company_name": "Microsoft",
                      "phone_number": "+1 425-882-8080",
                      "street_address": "One Microsoft Way",
                      "city": "Redmond",
                      "state": "Washington",
                      "zip_code": "98052",
                      "country": "USA",
                      "company_url": "https://careers.microsoft.com",
                      "created_at": "2025-12-21 11:16:29",
                      "Image": "profile_1766329568.png",
                      "total_jobs": 1,
                      "total_applications": 0
                  },
                  {
                      "company_id": 6,
                      "company_name": "J-a",
                      "phone_number": "01211125898",
                      "street_address": "smart Village 1st gate",
                      "city": "Smart Village",
                      "state": "Giaza",
                      "zip_code": "11231",
                      "country": "Egypt",
                      "company_url": "https://github.com/MazenMDev/internship-job-portal",
                      "created_at": "2025-12-21 17:27:14",
                      "Image": "profile_1766330936.png",
                      "total_jobs": 0,
                      "total_applications": 0
                  }
              ]
          }
        */
        allCompanies = data.companies;
        defaultCompanies = data.companies;

        $("#companiesPanel").html(`
          <h2 id="companiesTitle">Companies (${allCompanies.length})</h2>
          <input
            type="text"
            class="search-input"
            id="companySearchInput"
            placeholder="Search companies..."
          />
          <div id="companiesTableContainer"></div>
        `);

        $("#companiesPanel")
          .find("#companySearchInput")
          .on("input", function () {
            const query = $(this).val();
            if (!query || query.trim() === "") {
              allCompanies = defaultCompanies;
              currentPage = 1;
              displayCompanies();
              return;
            }
            const filteredCompanies = searchArray(query, defaultCompanies);
            allCompanies = filteredCompanies;
            currentPage = 1;
            displayCompanies();
          });

        displayCompanies();
      })
      .catch((error) => {
        console.error("Error fetching companies:", error);
        $("#companiesPanel").html(
          "<h3>Error loading companies. Please try again.</h3>"
        );
      });
  }

  function displayCompanies() {
    const total = allCompanies.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompanies = allCompanies.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    $("#companiesTitle").text(`Companies (${total})`);

    let htmlContent = "";

    if (total === 0) {
      htmlContent += '<div class="no-results">No companies found.</div>';
      $("#companiesTableContainer").html(htmlContent);
      return;
    }

    htmlContent += `
      <div class="companies-table-container">
      <table class="companies-table">
        <thead>
          <tr>
            <th>Company ID</th>
            <th>Image</th>
            <th>Company Name</th>
            <th>Phone Number</th>
            <th>Profile</th>
            <th>Address</th>
            <th>Website</th>
            <th>Created At</th>
            <th>Total Jobs</th>
            <th>Total Applications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginatedCompanies.forEach((company) => {
      let image_url = "/ImageStorage/company.png";
      if (company.Image != "company.png") {
        image_url = `/ImageStorage/companies/${company.company_id}/${company.Image}`;
      }
      htmlContent += `
        <tr id="companyRow_${company.company_id}">
          <td>${company.company_id}</td>
          <td><img src="${image_url}" alt="Company Image" loading="lazy" class="company-image"></td>
          <td>${company.company_name}</td>
          <td>${company.phone_number}</td>
          <td><a href="/pages/profile.html?id=${company.company_id}&type=company" target="_blank">View Profile</a></td>
          <td>${company.street_address}, ${company.city}, ${company.state}, ${company.zip_code}, ${company.country}</td>
          <td><a href="${company.company_url}" target="_blank">${company.company_url}</a></td>
          <td>${company.created_at}</td>
          <td>${company.total_jobs}</td>
          <td>${company.total_applications}</td>
          <td>
            <button class="delete-company-btn" data-company-id="${company.company_id}" title="Delete Company">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      </div>
    `;
    htmlContent += '<div id="companiesPaginationContainer"></div>';

    $("#companiesTableContainer").html(htmlContent);

    $("#companiesTableContainer").on(
      "click",
      ".delete-company-btn",
      function (event) {
        event.preventDefault();
        const companyId = $(this).data("company-id");
        if (confirm("Are you sure you want to delete this company?")) {
          deleteCompany(companyId);
        }
      }
    );

    function deleteCompany(companyId) {
      let formData = new FormData();
      formData.append("company_id", companyId);
      fetch("/php/adminPanel/deleteCompany.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert(data.message || "Company deleted successfully");
            allCompanies = allCompanies.filter(
              (company) => company.company_id !== companyId
            );
            defaultCompanies = defaultCompanies.filter(
              (company) => company.company_id !== companyId
            );
            $("#totalCompanies").text(defaultCompanies.length);
            displayCompanies();
          } else {
            alert(data.error || "Failed to delete company");
          }
        })
        .catch((error) => {
          console.error("Error deleting company:", error);
          alert("Error deleting company. Please try again.");
        });
    }

    addPagination(
      "#companiesPaginationContainer",
      total,
      itemsPerPage,
      currentPage,
      function (nextPage) {
        currentPage = nextPage;
        displayCompanies();
      }
    );
  }
}

function handleJobsTable() {
  let allJobs = [];
  let defaultJobs = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  loadJobs();

  function loadJobs() {
    $("#jobsPanel").html('<div class="loading">Loading jobs...</div>');

    fetch("/php/adminPanel/getAllJobs.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          $("#jobsPanel").html(`<h3>${data.error}</h3>`);
          return;
        }
        /*
          console.log(data);
          {
              "jobs": [
                  {
                      "job_id": 1,
                      "company_id": 1,
                      "company_name": "Job Connect Test Account",
                      "title": "Test Job Posting",
                      "job_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel aliquam tellus, sit amet porttitor quam. Cras eu erat sed ipsum laoreet tincidunt. Mauris commodo tincidunt turpis, ut ullamcorper ex sollicitudin sed. Nulla varius mattis orci, quis blandit nisl dapibus eu. Cras quam elit, auctor eget enim et, euismod elementum risus. Nam odio sem, pharetra nec tincidunt vitae, rhoncus nec sapien. Integer sem ex, pellentesque id libero ut, volutpat pharetra lacus. Vestibulum et lacinia massa. Morbi ornare nisi at placerat egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas sagittis vehicula nisi eu tempor. In non ligula metus. Praesent faucibus, nibh eu bibendum sodales, lorem odio consectetur tellus, vel vulputate quam leo eu quam.\r\n\r\nAliquam erat volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eget pulvinar magna. Cras vitae nisi eu sem vestibulum commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut sit amet nisi vulputate nisl fringilla ultricies. Nulla viverra ornare massa a rhoncus. Praesent consequat, quam nec porta mollis, ligula neque consequat nibh, sed ultricies nibh augue in ex. Curabitur feugiat risus vel mi vulputate, tincidunt volutpat purus maximus. Ut vitae nisl eu quam fermentum imperdiet eu in metus. Aliquam sed lectus leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin id semper erat.",
                      "location": "Fisal, Egypt",
                      "category": "Software Development",
                      "experience": "No Experience",
                      "job_type": "part-time",
                      "is_deleted": 0,
                      "min_salary": 10000,
                      "max_salary": 20000,
                      "created_at": "2025-12-13 16:12:14"
                  },
                  {
                      "job_id": 2,
                      "company_id": 2,
                      "company_name": "testing_COMPANY_verif",
                      "title": "Job 2",
                      "job_description": "This a description for this job test posting, aasdadasdfsad",
                      "location": "Fisal, Egyptaaa",
                      "category": "Network & System Administration",
                      "experience": "3 years+",
                      "job_type": "remote",
                      "is_deleted": 0,
                      "min_salary": 20000,
                      "max_salary": 40000,
                      "created_at": "2025-12-19 23:54:33"
                  },
                  {
                      "job_id": 3,
                      "company_id": 1,
                      "company_name": "Job Connect Test Account",
                      "title": "SE",
                      "job_description": "telll me do you bleetelll me do you bleetelll me do you bleetelll me do you bleetelll me do you bleetelll me do you bleetelll me do you bleetelll me do you blee",
                      "location": "Fisal, Egypt",
                      "category": "Software Development",
                      "experience": "sdfsd",
                      "job_type": "part-time",
                      "is_deleted": 0,
                      "min_salary": 12005,
                      "max_salary": 66767,
                      "created_at": "2025-12-21 10:02:57"
                  }
              ]
          }
        */
        allJobs = data.jobs;
        defaultJobs = data.jobs;

        $("#jobsPanel").html(`
          <h2 id="jobsTitle">Jobs (${allJobs.length})</h2>
          <input
            type="text"
            class="search-input"
            id="jobSearchInput"
            placeholder="Search jobs..."
          />
          <div id="jobsTableContainer"></div>
        `);

        $("#jobsPanel")
          .find("#jobSearchInput")
          .on("input", function () {
            const query = $(this).val();
            if (!query || query.trim() === "") {
              allJobs = defaultJobs;
              currentPage = 1;
              displayJobs();
              return;
            }
            const filteredJobs = searchArray(query, defaultJobs);
            allJobs = filteredJobs;
            currentPage = 1;
            displayJobs();
          });

        displayJobs();
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        $("#jobsPanel").html("<h3>Error loading jobs. Please try again.</h3>");
      });
  }

  function displayJobs() {
    const total = allJobs.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedJobs = allJobs.slice(startIndex, startIndex + itemsPerPage);

    $("#jobsTitle").text(`Jobs (${total})`);

    let htmlContent = "";

    if (total === 0) {
      htmlContent += '<div class="no-results">No jobs found.</div>';
      $("#jobsTableContainer").html(htmlContent);
      return;
    }

    htmlContent += `
      <div class="jobs-table-container">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Category</th>
            <th>Job Type</th>
            <th>Experience</th>
            <th>Salary Range</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginatedJobs.forEach((job) => {
      const statusText = job.is_deleted == 1 ? "Hidden" : "Visible";
      const toggleText = job.is_deleted == 1 ? "Unhide" : "Hide";

      htmlContent += `
        <tr id="jobRow_${job.job_id}">
          <td>${job.job_id}</td>
          <td>${job.title}</td>
          <td>${job.company_name}</td>
          <td>${job.location}</td>
          <td>${job.category}</td>
          <td>${job.job_type}</td>
          <td>${job.experience}</td>
          <td>${job.min_salary} - ${job.max_salary}</td>
          <td>${statusText}</td>
          <td>${job.created_at}</td>
          <td>
  <button class="toggle-job-btn"
          data-job-id="${job.job_id}"
          data-is-deleted="${job.is_deleted}"
          title="${toggleText}">
    ${
      job.is_deleted == 1
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
             <circle cx="12" cy="12" r="3"/>
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20
                      c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-5.94"/>
             <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4
                      c7 0 11 8 11 8a21.77 21.77 0 0 1-4.88 5.82"/>
             <line x1="1" y1="1" x2="23" y2="23"/>
           </svg>`
    }
  </button>

  <button class="delete-job-btn"
          data-job-id="${job.job_id}"
          title="Delete job">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  </button>
</td>

        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      </div>
    `;
    htmlContent += '<div id="jobsPaginationContainer"></div>';

    $("#jobsTableContainer").html(htmlContent);
    $("#jobsTableContainer").off("click", ".toggle-job-btn");
    $("#jobsTableContainer").on("click", ".toggle-job-btn", function (e) {
      e.preventDefault();
      const btn = $(this);
      const jobId = btn.data("job-id");
      const current = btn.data("is-deleted") == 1 ? 1 : 0;
      const next = current ? 0 : 1;

      const formData = new FormData();
      formData.append("action", "toggle");
      formData.append("job_id", jobId);
      formData.append("is_deleted", next);

      fetch("/php/adminPanel/deleteAllJobs.php", {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            alert(data.message || "Job visibility updated");

            allJobs = allJobs.map((j) =>
              j.job_id === jobId ? { ...j, is_deleted: next } : j
            );
            defaultJobs = defaultJobs.map((j) =>
              j.job_id === jobId ? { ...j, is_deleted: next } : j
            );

            displayJobs();
          } else {
            alert(data.error || "Failed to update job visibility");
          }
        })
        .catch((error) => {
          console.error("Error updating job visibility:", error);
          alert("Error updating job visibility. Please try again.");
        });
    });

    $("#jobsTableContainer").off("click", ".delete-job-btn");
    $("#jobsTableContainer").on("click", ".delete-job-btn", function (e) {
      e.preventDefault();
      const jobId = $(this).data("job-id");
      if (!confirm("Are you sure you want to permanently delete this job?")) {
        return;
      }

      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("job_id", jobId);

      fetch("/php/adminPanel/deleteAllJobs.php", {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            alert(data.message || "Job deleted successfully");
            allJobs = allJobs.filter((job) => job.job_id !== jobId);
            defaultJobs = defaultJobs.filter((job) => job.job_id !== jobId);
            displayJobs();
          } else {
            alert(data.error || "Failed to delete job");
          }
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          alert("Error deleting job. Please try again.");
        });
    });

    addPagination(
      "#jobsPaginationContainer",
      total,
      itemsPerPage,
      currentPage,
      function (nextPage) {
        currentPage = nextPage;
        displayJobs();
      }
    );
  }
}

function handleApplicationsTable() {
  let allApps = [];
  let defaultApps = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  loadApplications();

  function loadApplications() {
    $("#jobApplication").html(
      '<div class="loading">Loading applications...</div>'
    );

    fetch("/php/adminPanel/getAllApplications.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          $("#jobApplication").html(`<h3>${data.error}</h3>`);
          return;
        }
        /*
        console.log(data)
          {
              "applications": [
                  {
                      "application_id": 7,
                      "user_id": 1,
                      "user_name": "Kareem",
                      "job_id": 1,
                      "job_title": "Test Job Posting",
                      "company_id": 1,
                      "company_name": "Job Connect Test Account",
                      "applicant_name": "Kareem Ahmed",
                      "email": "kareem99710@gmail.com",
                      "resume": "",
                      "experience_level": "mid-level",
                      "additional_note": "hi",
                      "cover_letter": "hi",
                      "application_date": "2025-12-20 21:59:14"
                  },
                  {
                      "application_id": 5,
                      "user_id": 1,
                      "user_name": "Kareem",
                      "job_id": 2,
                      "job_title": "Job 2",
                      "company_id": 2,
                      "company_name": "testing_COMPANY_verif",
                      "applicant_name": "Kareem Ahmed",
                      "email": "kareem99710@gmail.com",
                      "resume": "",
                      "experience_level": "mid-level",
                      "additional_note": "test",
                      "cover_letter": "test",
                      "application_date": "2025-12-20 19:41:14"
                  }
              ]
          }
        */
        allApps = data.applications;
        defaultApps = data.applications;

        $("#jobApplication").html(`
          <h2 id="applicationsTitle">Applications (${allApps.length})</h2>
          <input
            type="text"
            class="search-input"
            id="applicationSearchInput"
            placeholder="Search job applications..."
          />
          <div id="applicationsTableContainer"></div>
        `);

        $("#jobApplication")
          .find("#applicationSearchInput")
          .on("input", function () {
            const query = $(this).val();
            if (!query || query.trim() === "") {
              allApps = defaultApps;
              currentPage = 1;
              displayApplications();
              return;
            }
            const filtered = searchArray(query, defaultApps);
            allApps = filtered;
            currentPage = 1;
            displayApplications();
          });

        displayApplications();
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        $("#jobApplication").html(
          "<h3>Error loading applications. Please try again.</h3>"
        );
      });
  }

  function displayApplications() {
    const total = allApps.length;
    const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = allApps.slice(startIndex, startIndex + itemsPerPage);

    $("#applicationsTitle").text(`Applications (${total})`);

    let htmlContent = "";

    if (total === 0) {
      htmlContent += '<div class="no-results">No applications found.</div>';
      $("#applicationsTableContainer").html(htmlContent);
      return;
    }

    htmlContent += `
      <div class="users-table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>User</th>
            <th>User ID</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Company ID</th>
            <th>Email</th>
            <th>Experience Level</th>
            <th>Applied At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    paginated.forEach((app) => {
      htmlContent += `
        <tr id="appRow_${app.application_id}">
          <td>${app.application_id}</td>
          <td>${app.user_name || app.applicant_name}</td>
          <td>${app.user_id}</td>
          <td>${app.job_title}</td>
          <td>${app.company_name}</td>
          <td>${app.company_id}</td>
          <td>${app.email}</td>
          <td>${app.experience_level}</td>
          <td>${app.application_date}</td>
          <td>
          <button class="delete-application-btn"
          data-application-id="${app.application_id}"
          title="Delete application">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
        </button>
        </td>
        </tr>
      `;
    });

    htmlContent += `
        </tbody>
      </table>
      </div>
    `;
    htmlContent += '<div id="applicationsPaginationContainer"></div>';

    $("#applicationsTableContainer").html(htmlContent);

    $("#applicationsTableContainer").off("click", ".delete-application-btn");
    $("#applicationsTableContainer").on(
      "click",
      ".delete-application-btn",
      function (e) {
        e.preventDefault();
        const appId = $(this).data("application-id");
        if (!confirm("Are you sure you want to delete this application?")) {
          return;
        }

        const formData = new FormData();
        formData.append("action", "delete");
        formData.append("application_id", appId);

        fetch("/php/adminPanel/deleteJobApplications.php", {
          method: "POST",
          body: formData,
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success) {
              alert(data.message || "Application deleted successfully");
              allApps = allApps.filter((a) => a.application_id !== appId);
              defaultApps = defaultApps.filter(
                (a) => a.application_id !== appId
              );
              displayApplications();
            } else {
              alert(data.error || "Failed to delete application");
            }
          })
          .catch((error) => {
            console.error("Error deleting application:", error);
            alert("Error deleting application. Please try again.");
          });
      }
    );

    addPagination(
      "#applicationsPaginationContainer",
      total,
      itemsPerPage,
      currentPage,
      function (nextPage) {
        currentPage = nextPage;
        displayApplications();
      }
    );
  }
}

$(document).ready(function () {
  handleTotals();
  handleCompanyVerification();
  handleMessages();
  handleUsersTable();
  handleCompaniesTable();
  handleJobsTable();
  handleApplicationsTable();
});
