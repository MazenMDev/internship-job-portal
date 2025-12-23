const form = document.getElementById("forgetPasswordForm");


form.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = form.elements["email"].value;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending email...";

  const formInputs = form.querySelectorAll('input, button');
  formInputs.forEach(input => input.disabled = true);

  const messageElement = document.getElementById("message");
  messageElement.style.display = "none";

  const formData = new FormData();
  formData.append("email", email);
  fetch("../php/handle_forget_password.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      messageElement.style.display = "block";
      if (data.status === 'success') {
        messageElement.style.color = "green";
        messageElement.textContent = data.message;
        form.reset();
      } else {
        messageElement.style.color = "red";
        messageElement.textContent = data.message;
        formInputs.forEach(input => input.disabled = false);
        submitBtn.textContent = originalBtnText;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      messageElement.style.display = "block";
      messageElement.style.color = "red";
      messageElement.textContent = "Something went wrong. Please try again.";
      formInputs.forEach(input => input.disabled = false);
      submitBtn.textContent = originalBtnText;
    });
});
