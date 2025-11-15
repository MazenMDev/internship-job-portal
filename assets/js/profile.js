document.addEventListener("DOMContentLoaded", () => {
  // --- Modal Setup ---
  const editButton = document.getElementById("profile-edit"); // Button to OPEN the modal
  const closeBtn = document.getElementById("edit-close");
  const backdrop = document.getElementById("blurred-background");

  // --- Form Element Setup ---
  // 1. Get the FORM itself using its new unique ID
  const profileForm = document.getElementById("edit-form");

  // 2. Get the INPUTS from the form using their new unique IDs
  const fnameInput = document.getElementById("fname");
  const lnameInput = document.getElementById("lname");
  const bioInput = document.getElementById("bio");
  const aboutInput = document.getElementById("about-edit");
  const experience_titleInput = document.getElementById("experience-title");
  const experienceInput = document.getElementById("experience");

  // 3. Get the DISPLAY elements on the main page
  const displayNameEl = document.querySelector(".profile-section .name");
  const displayHeadlineEl = document.querySelector(
    ".profile-section .headline"
  );
  const displayAboutEl = document.querySelector(".profile-section .about p");
  const displayExperienceEl = document.querySelector(
    ".profile-section .experience p"
  ); // Grabs the first <p> in experience

  const STORAGE_KEY = "userProfile";

  document.getElementById("profile-edit").addEventListener("click", openModal);

  let selectedImageFile = null;
  function uploadImageToServer(file) {
    const formData = new FormData();
    formData.append("profile_image", file);

    fetch("../../php/upload-profile-image.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.querySelector(".profile-photo").src = data.image_url;
          document.querySelector(".profile-photo2").src = data.image_url;
          document.querySelector(".profile-nav-photo").src = data.image_url;
          document.querySelector(".profile-dropdown-photo").src = data.image_url;
        } else {
          alert(data.message || "Error uploading image");
        }
      })
      .catch((err) => console.error(err));
  }

  function openModal() {
    loadProfileDataIntoForm();
    document.body.classList.add("edit-open");
  }
  function closeModal() {
    document.body.classList.remove("edit-open");
    if (selectedImageFile) {
      document.querySelector(".profile-photo2").src = "";
      uploadImageToServer(selectedImageFile);
      fetchProfileData();
      selectedImageFile = null;
    }
  }

  function loadProfileDataIntoForm() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const profile = JSON.parse(savedData);

      // Split the full name back into first and last
      const nameParts = (profile.name || "").split(" ");
      fnameInput.value = nameParts[0] || "";
      lnameInput.value = nameParts.slice(1).join(" ") || "";

      bioInput.value = profile.headline || "";
      aboutInput.value = profile.about || "";
      experience_titleInput.value = profile.experienceTitle || "";
      experienceInput.value = profile.experience || "";
    }
    else
    {
      const nameParts = (profile.name || "").split(" ");
      fnameInput.value = "";
      lnameInput.value = "";

      bioInput.value = "";
      aboutInput.value ="";
      experience_titleInput.value = "";
      experienceInput.value ="";
    }
  }

  // This function loads data and updates the MAIN PAGE DISPLAY
  function loadProfileDataOntoPage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const profile = JSON.parse(savedData);

      // Update the text on the page
      displayNameEl.textContent = profile.name || "Profile Name";
      displayHeadlineEl.textContent =
        profile.headline || "";
      displayAboutEl.textContent =
        profile.about || "";
      displayExperienceEl.innerHTML = `<strong>${profile.experienceTitle}</strong> <br> ${profile.experience}`;
    }
  }

  // This is your SAVE function, now corrected
  function saveProfile(event) {
    event.preventDefault(); // Stop page from reloading

    // 4. Create the data object using the CORRECT input variables
    const profileData = {
      name: `${fnameInput.value} ${lnameInput.value}`.trim(), // Combine first and last name
      headline: bioInput.value,
      about: aboutInput.value,
      experienceTitle: experience_titleInput.value,
      experience: experienceInput.value,
    };

    // 5. Save the new data to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));

    alert("Profile saved!");
    closeModal(); // Close the popup after saving
    loadProfileDataOntoPage(); // Immediately update the page with the new info
  }

  // --- Event Listeners ---
  editButton.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  // 6. Add the 'submit' listener to the correct FORM variable
  profileForm.addEventListener("submit", saveProfile);

  // --- Initial Page Load ---
  // 7. Load data onto the page when you first visit
  loadProfileDataOntoPage();

  document.getElementById("view-photo").addEventListener("click", uploadPhoto);
  function uploadPhoto() {
    // create a hidden file input to choose an image
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.querySelector(".profile-photo2").src = e.target.result;
        };
        reader.readAsDataURL(file);
        selectedImageFile = file;
      }
    };
  }
});

// Get the current URL path
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
fetchProfileData();
function fetchProfileData() {
  if (userId) {
    fetch(`../php/profile.php?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          document.body.innerHTML = `<h2>${data.error}</h2>`;
        } else {
          if (data.Image == "profile.jpeg") {
            document.querySelector(
              ".profile-photo"
            ).src = `../ImageStorage/profile.jpeg`;
          } else {
            document.querySelector(
              ".profile-photo"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
            document.querySelector(
              ".profile-photo2"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
            document.querySelector(
              ".profile-nav-img"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
            document.querySelector(
              ".profile-dropdown-img"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
          }

          document.querySelector(
            ".profile-section .name"
          ).textContent = `${data.First_Name} ${data.Last_Name}`;

          if (data.Title) {
            document.querySelector(".profile-section .headline").textContent =
              data.Title;
          } else {
            document.querySelector(".profile-section .headline").textContent =
              "";
          }
          if (data.Bio) {
            document.querySelector(".profile-section .about p").textContent =
              data.Bio;
          } else {
            document.querySelector(".profile-section .about p").textContent =
              "";
          }

          if (data.is_owner === true) {
            document.getElementById("profile-edit").style.display = "block";
          } else {
            document.getElementById("profile-edit").style.display = "none";
          }
        }
      })
      .catch((err) => {
        document.body.innerHTML = `<h2>Error loading profile</h2>`;
        console.error(err);
      });
  } else {
    //document.body.innerHTML = "<h2>Invalid profile URL</h2>";
  }
}
