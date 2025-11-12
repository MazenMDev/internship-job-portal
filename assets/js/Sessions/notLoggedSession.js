document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../php/session_check.php");
    const data = await res.json();

    if (!data.logged_in) {
        document.querySelectorAll(".userLogged").forEach((el) => {
            el.style.display = "none";
        });
        document.querySelector(".admin-panel-link").style.display = "none";
    } else {
      document.querySelectorAll(".sign").forEach((el) => {
        el.style.display = "none";
      });

      document.querySelector(".signout-btn").addEventListener("click", async () => {
        try {
          const res = await fetch("../php/logout.php", {
            method: "POST",
          });
          const data = await res.json();
          if (data.success) {
            window.location.href = "./login.html";
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      });

      document.querySelectorAll(".join").forEach((el) => {
        el.style.display = "none";
      });
      
      const profileEl = document.querySelector(".profileName");
      let name = "";
      if (data.first_name) {
        name = data.first_name;
      }
      if (data.last_name) {
        name = name ? `${name} ${data.last_name}` : data.last_name;
      }
      if (profileEl) {
        profileEl.textContent = name;
      }

      document.querySelector(".admin-panel-link").style.display = data.is_admin ? "block" : "none";

      document.querySelector(".profileEducation").textContent = data.title
      document.querySelector(".profile-dropdown-img").src = data.image
          ? "/internship-job-portal/ImageStorage/" + data.image
          : "/internship-job-portal/ImageStorage/profile.jpeg";
      }

      if(data.is_company){
        document.querySelector(".dropdown-section").style.display = "none";
      }
    }
   catch (error) {
    console.error("Error checking session:", error);
  }
  
    document.getElementById("loadingScreen").style.display = "none";
});
