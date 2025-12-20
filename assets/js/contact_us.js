document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const lastMessage = localStorage.getItem("lastMessage");
  if (lastMessage) {
    const lastMessageTime = parseInt(lastMessage, 10);
    const currentTime = Date.now();
    const timeDiff = currentTime - lastMessageTime;
    const threeHour = 60 * 60 * 1000 * 3;
    if (timeDiff < threeHour) {
      document.getElementById("form-error").textContent = "You can only send one message every 3 hours.";
      throw new Error("Message limit reached");
      return;
    }
  }

  const formdata = new FormData();
  const email = document.querySelector(".contact-form #email").value;
  const firstname = document.querySelector(".contact-form #firstname").value;
  const lastname = document.querySelector(".contact-form #lastname").value;
  const message = document.querySelector(".contact-form #message").value;

  formdata.append("firstname", firstname);

  formdata.append("lastname", lastname);

  formdata.append("message", message);

  formdata.append("email", email);

  fetch("../php/contactus.php", {
    method: "POST",
    body: formdata,
  })
    .then((result) => result.json())
    .then((data) => {
      if (data.status == "success") {
        alert(data.message);
        localStorage.setItem("lastMessage", Date.now().toString());
        document.querySelector(".contact-form #email").value = "";
        document.querySelector(".contact-form #firstname").value = "";
        document.querySelector(".contact-form #lastname").value = "";
        document.querySelector(".contact-form #message").value = "";
        window.location.reload();
      } else {
        document.getElementById("form-error").textContent = data.message;
      }
    })
    .catch(() => {
      document.getElementById("form-error").textContent = "Something went wrong. Please try again later.";
    });
});
