//This js file is added to pages where user is required to be logged in to view

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../php/session_check.php");
    const data = await res.json();
    /*
      data example:
      {
        "logged_in": true,
        "user_id": 1,
        "email": "admin@gmail.com",
        "first_name": "Kareem",
        "last_name": "Ahmed",
        "title": null,
        "theme": "light",
        "image": "profile_1763214550.png",
        "is_admin": 1,
        "is_company": true
      }
    */

    if (!data.logged_in) {
      window.location.href = "./login-register.html?method=2";
    } else {
      document.querySelectorAll(".sign").forEach((el) => {
        el.style.display = "none";
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
      if (document.querySelector(".admin-panel-link")) {
        document.querySelector(".admin-panel-link").style.display =
          data.is_admin ? "block" : "none";
      }
      if(data.title){
        document.querySelector(".profileEducation").textContent = data.title;
      }
      else{
        document.querySelector(".profileEducation").textContent = "";
      }

      if (data.image == "profile.jpeg") {
        document.querySelector(
          ".profile-dropdown-img"
        ).src = `../ImageStorage/profile.jpeg`;
        document.querySelector(
          ".profile-nav-img"
        ).src = `../ImageStorage/profile.jpeg`;
      } else {
        document.querySelector(
          ".profile-dropdown-img"
        ).src = `../ImageStorage/${data.user_id}/${data.image}`;
        document.querySelector(
          ".profile-nav-img"
        ).src = `../ImageStorage/${data.user_id}/${data.image}`;
      }

      if (data.is_company) {
        document.querySelector(".dropdown-section").style.display = "none";
      }
      if (data.theme === "dark") {
        document.body.classList.add("darkmode");
      }
      if (document.body.classList.contains("darkmode")) {
        document.querySelectorAll(".themeToggle").forEach((toggle) => {
          toggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
        });
      } else {
        document.querySelectorAll(".themeToggle").forEach((toggle) => {
          toggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      `;
        });
      }

      document.querySelector(".view-profile-btn").href =
        "../../../pages/profile.html?id=" + data.user_id;

      document.querySelector(".signout-btn").addEventListener("click", async () => {
        await fetch("../php/logout.php");
        window.location.href = "./login-register.html?method=2";
      });
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
  document.getElementById("loadingScreen").style.display = "none";
});
