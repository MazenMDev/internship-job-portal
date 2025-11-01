document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../php/session_check.php");
    const data = await res.json();

    if (!data.logged_in) {
      window.location.href = "./login.html";
    } else {
      document.querySelectorAll(".sign").forEach((el) => {
        el.textContent = "Logout";
        el.href = "../php/logout.php";
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
});
