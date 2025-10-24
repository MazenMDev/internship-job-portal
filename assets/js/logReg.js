document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#email-login, #password-login");

  inputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    const text = label.innerText.trim();
    label.innerHTML = [...text]
      .map(
        (letter, index) =>
          `<span style="display:inline-block; will-change: transform, color; transition: transform 280ms cubic-bezier(.22,.61,.36,1), color 200ms linear; transition-delay:${
            index * 40
          }ms">${letter}</span>`
      )
      .join("");

    label.style.willChange = "transform, color";
    label.style.transition = "transform 300ms cubic-bezier(.22,.61,.36,1)";

    const spans = label.querySelectorAll("span");

    const update = () => {
      const active =
        document.activeElement === input || input.value.trim() !== "";

      label.style.transform = active ? "translateY(-250%)" : "translateY(-50%)";

      spans.forEach((span, i) => {
        span.style.display = "inline-block";
        span.style.transform = active
          ? "translate3d(0,-10px,0)"
          : "translate3d(0,0,0)";
        span.style.color = active
          ? "var(--primary-color)"
          : "var(--text-muted)";
        span.style.opacity = active ? "1" : "0.92";
      });
    };

    input.addEventListener("focus", update);
    input.addEventListener("blur", update);
    input.addEventListener("input", update);

    update();
  });
});
