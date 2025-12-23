const form = document.getElementById("forgetPasswordForm");


form.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = form.elements["email"].value;

  const formData = new FormData();
  formData.append("email", email);
  fetch("../php/handle_forget_password.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const messageElement = document.getElementById("message");
      messageElement.style.display = "block";
      if (data.status === 'success') {
        messageElement.style.color = "green";
        messageElement.textContent = data.message;
        form.reset();
      } else {
        messageElement.style.color = "red";
        messageElement.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
