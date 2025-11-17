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
          document.querySelector(".profile-nav-img").src = data.image_url;
          document.querySelector(".profile-dropdown-img").src = data.image_url;
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
            document.querySelector(
              ".profile-photo2"
            ).src = `../ImageStorage/profile.jpeg`;
          } else {
            document.querySelector(
              ".profile-photo"
            ).src = `../ImageStorage/${userId}/${data.Image}`;
            document.querySelector(
              ".profile-photo2"
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
            document.querySelector(".profile-photo").style.cursor = "default";
            document.querySelector(".profile-photo2").style.cursor = "default";
            document.querySelector(".profile-photo").style.pointerEvents = "none";
            document.querySelector(".profile-photo2").style.pointerEvents = "none";

          }
          if(data.is_company){
            fetch("../php/company-profile.php?id=" + userId)
            .then((res) => res.json())
            .then((companyData) => {
              showCompanyInfo(companyData , data);
              changeFormToCompanyProfile(companyData , data);
            })
            .catch((err) => {
              console.error(err);
            });
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

function showCompanyInfo(companyData){

  document.querySelector(".profile-section").innerHTML = `
    <div class="name">${companyData.company_name}</div>
    <div class="headline">${companyData.company_email}</div>
    <div class="about">
      <h2>About Us</h2>
      <p>${companyData.description || ""}</p>
    </div>

    <div class"phone-number">
      <h2>Phone Number</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:10px;">
        <svg style="width:24px; height:24px; color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
        <a href="tel:${companyData.phone_number || ""}">${companyData.phone_number || ""}</a>
      </div>
    </div>
    
    <div class="website">
      <h2>Website</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:10px;">
      <svg style="width:24px; height:24px; color: var(--text-muted);" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>  
      <a href="${companyData.company_url || "#"}" target="_blank">${companyData.company_name || ""}</a>
      </div>
    </div>
    
    <div class="location">
      <h2>Location</h2>
      <div style="display:flex; flex-direction:row; align-items:center; gap:2px;">
      <p>${companyData.country || ""},</p>
      <p>${companyData.city || ""},</p>
      <p>${companyData.state || ""},</p>
      <p>${companyData.street_address || ""},</p>
      <p>${companyData.zip_code || ""}</p>
      </div>
    </div>

    


  `;
}

function changeFormToCompanyProfile(companyData){
  document.querySelector(".editTitle").textContent = "Edit your Company profile";
  document.getElementById("formEdit").innerHTML = `
          <div class="inp" id="name-div">
            <label for="companyName">Company Name</label
            ><input class="holder" type="text" name="companyName" id="companyName" />
          </div>
        <div class="inp" id="desc-div">
          <label for="companyDesc">Description</label>
          <textarea class="holder" type="text" name="companyDesc" id="companyDesc"></textarea>
        </div>
        
        <div class="inp" id="phone-div">
          <label for="phone-number">Phone Number</label
          ><input class="holder" type="text" name="phone-number" id="phone-number" />
        </div>
        <div class="inp" id="website-div">
          <label for="website">Website URL</label
          ><input class="holder" type="text" name="website" id="website" />
        </div>
        <div class="grid">
          <div class="inp" id="country-div">
            <label for="companyCountry">Country</label
            ><input class="holder" type="text" name="companyCountry" id="companyCountry" />
          </div>
          <div class="inp" id="state-div">
            <label for="companyState">State</label
            ><input class="holder" type="text" name="companyState" id="companyState" />
          </div>
        </div>
        <div class="grid">
          <div class="inp" id="city-div">
            <label for="companyCity">City</label>
            <input class="holder" type="text" name="companyCity" id="companyCity" />
          </div>
          <div class="inp" id="street-div">
            <label for="companyStreetAddress">Street Address</label
            ><input class="holder" type="text" name="companyStreetAddress" id="companyStreetAddress" />
          </div>
        </div>
          <div class="inp" id="zip-div">
            <label for="companyZipCode">Zip Code</label
            ><input class="holder" type="text" name="companyZipCode" id="companyZipCode" />
          </div>
        
        
        
      <div class="inp">
          <input type="submit" value="Save changes" class="submit" />
        </div>
  `;
  document.getElementById("companyName").value = companyData.company_name || "";
  document.getElementById("companyDesc").value = companyData.description || "";
  document.getElementById("phone-number").value = companyData.phone_number || "";
  document.getElementById("website").value = companyData.company_url || "";
  document.getElementById("companyCountry").value = companyData.country || "";
  document.getElementById("companyState").value = companyData.state || "";
  document.getElementById("companyCity").value = companyData.city || "";
  document.getElementById("companyStreetAddress").value = companyData.street_address || "";
  document.getElementById("companyZipCode").value = companyData.zip_code || "";


} 