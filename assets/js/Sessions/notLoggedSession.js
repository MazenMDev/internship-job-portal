document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../php/session_check.php");
    const data = await res.json();

    if (!data.logged_in) {
        
    } else {
      document.querySelectorAll(".sign").forEach((el) => {
        el.textContent = "Logout";
        el.href = "../php/logout.php";
      });

      document.querySelectorAll(".join").forEach((el) => {
        el.style.display = "none";
      });

      console.log(data);
    }
  } catch (error) {
    console.error("Error checking session:", error);
  }
});
