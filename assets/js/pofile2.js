document.getElementById("open-edit-panel").addEventListener("click", () => {
document.getElementById("edit-panel").classList.add("active");
document.body.classList.add("panel-open");
});


document.getElementById("close-edit-panel").addEventListener("click", () => {
document.getElementById("edit-panel").classList.remove("active");
document.body.classList.remove("panel-open");
});