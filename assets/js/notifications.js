document.addEventListener("DOMContentLoaded", function () {
  function loadNotifications() {
    fetch("../php/notification.php", {})
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.querySelector(".notifications_unseen").style = "none";
        const container = document.getElementById("notificationList");
        const notifCount = document.getElementById("notification-count");

        if (notifCount) {
          notifCount.innerText = data.length;
          notifCount.style.display = data.length > 0 ? "inline-block" : "none";
        }

        container.innerHTML = "";

        data.forEach((notif) => {
          const cardHTML = `
                    <div class="notification-card">
                        <img 
                            src="${notif.image}" 
                            alt="Profile" 
                            class="notification-profile-img" 
                        />
                        <div class="notification-content">
                            <p><strong>${notif.title}</strong>: ${notif.description}</p>
                            <span class="notification-time">${notif.created_at}</span>
                        </div>
                    </div>
                `;

          container.innerHTML += cardHTML;
        });
      })
      .catch((error) => console.error("Error:", error));
  }
  loadNotifications();
});
