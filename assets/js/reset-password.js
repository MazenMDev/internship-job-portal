document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    const messageElement = document.getElementById("message");
    messageElement.style.display = "block";
    messageElement.style.color = "var(--error)";
    messageElement.textContent =
      "Invalid or missing reset token. Please request a new password reset link.";
    return;
  }

  fetch("../php/check_reset_request.php?token=" + encodeURIComponent(token))
    .then((response) => response.json())
    .then((data) => {
      const messageElement = document.getElementById("message");
      const form = document.getElementById("resetPasswordForm");

      messageElement.style.display = "block";

      if (data.success) {
        messageElement.style.color = "var(--success)";
        messageElement.textContent = data.message;
        form.style.display = "block";

        form.addEventListener("submit", function (event) {
          event.preventDefault();

          const password = form.elements["password"].value;
          const confirmPassword = form.elements["confirm_password"].value;

          if (password !== confirmPassword) {
            messageElement.style.color = "var(--error)";
            messageElement.textContent = "Passwords do not match";
            return;
          }

          const formData = new FormData();
          formData.append("token", token);
          formData.append("password", password);
          formData.append("confirm_password", confirmPassword);

          fetch("../php/reset_password.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              messageElement.style.display = "block";

              if (data.status === "success") {
                messageElement.style.color = "var(--success)";
                messageElement.textContent = data.message;
                form.style.display = "none";

                setTimeout(function () {
                  window.location.href = "login-register.html";
                }, 3000);
              } else {
                messageElement.style.color = "var(--error)";
                messageElement.textContent = data.message;
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              messageElement.style.color = "var(--error)";
              messageElement.textContent =
                "An error occurred. Please try again.";
            });
        });
      } else {
        messageElement.style.color = "var(--error)";
        messageElement.textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      const messageElement = document.getElementById("message");
      messageElement.style.display = "block";
      messageElement.style.color = "var(--error)";
      messageElement.textContent =
        "An error occurred while verifying the reset link.";
    });
});
