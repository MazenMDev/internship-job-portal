document.addEventListener("DOMContentLoaded", function () {
  const openEditProfileBtn = document.getElementById("open-edit-profile-btn");
  const closeEditProfileBtn = document.getElementById("close-btn-edit-profile");
  const editProfileModal = document.getElementById("popup-edit-profile");
  const blurredBackground = document.getElementById("blurred-background");

  const editProfileForm = document.querySelector("#popup-edit-profile #form");

  function openPopupEditProfile() {
    if (editProfileModal) {
      editProfileModal.classList.add("open");
    }
    if (blurredBackground) {
      blurredBackground.classList.add("visible");
    }
  }

  function closePopupEditProfile() {
    if (editProfileModal) {
      editProfileModal.classList.remove("open");
    }
    if (blurredBackground) {
      blurredBackground.classList.remove("visible");
    }
  }

  if (openEditProfileBtn) {
    openEditProfileBtn.addEventListener("click", openPopupEditProfile);
  }

  if (closeEditProfileBtn) {
    closeEditProfileBtn.addEventListener("click", closePopupEditProfile);
  }

  if (blurredBackground) {
    blurredBackground.addEventListener("click", closePopupEditProfile);
  }

  if (editProfileForm) {
    editProfileForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(editProfileForm);
      const data = Object.fromEntries(formData.entries());
      console.log("Profile data saved:", data);

      closePopupEditProfile();
    });
  }
});
