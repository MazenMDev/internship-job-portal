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

  // --- Modal Functions ---
  function openModal() {
    // When modal opens, load the saved data into the form fields
    loadProfileDataIntoForm();
    document.body.classList.add("edit-open");
  }

  function closeModal() {
    document.body.classList.remove("edit-open");
  }

  // --- Data Functions ---

  // This function loads data from storage and puts it into the FORM INPUTS
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
  }

  // This function loads data and updates the MAIN PAGE DISPLAY
  function loadProfileDataOntoPage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const profile = JSON.parse(savedData);

      // Update the text on the page
      displayNameEl.textContent = profile.name || "Profile Name";
      displayHeadlineEl.textContent =
        profile.headline || "Computer Science Student | Aspiring Web Developer";
      displayAboutEl.textContent =
        profile.about || "Motivated and detail-oriented...";
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
});
