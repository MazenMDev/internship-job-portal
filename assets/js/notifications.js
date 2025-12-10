const notifications = [
    {
        img: "../assets/imgs/DefaultProfile/profile.jpeg",
        text: "Your application for the Software Engineer position has been received.",
        time: "2 hours ago"
    },
    {
        img: "../assets/imgs/DefaultProfile/profile.jpeg",
        text: "New job posting: Frontend Developer at TechCorp.",
        time: "1 day ago"
    },
    {
        img: "../assets/imgs/DefaultProfile/profile.jpeg",
        text: "Your profile has been viewed by HR at Innovatech.",
        time: "3 days ago"
    },
    {
        img: "../assets/imgs/DefaultProfile/profile.jpeg",
        text: "Congratulations! You have been shortlisted for an interview at Google.",
        time: "4 days ago"
    },
];

function loadNotifications() {
    const container = document.getElementById('notificationList');
    container.innerHTML = '';
    notifications.forEach(note => {
        const cardHTML = `
            <div class="notification-card">
                <img 
                    src="${note.img}" 
                    alt="Profile" 
                    class="notification-profile-img" 
                />
                <div class="notification-content">
                    <p>${note.text}</p>
                    <span class="notification-time">${note.time}</span>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
document.addEventListener('DOMContentLoaded', loadNotifications);