/*const notifications = [
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
];*/

/*function loadNotifications() {
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
document.addEventListener('DOMContentLoaded', loadNotifications); */


document.addEventListener("DOMContentLoaded", function() {
    
function loadNotifications() {
        fetch("../php/notification.php",{
        })

        .then(response => response.json())
        .then(data => {
            console.log(data);
            const notifList = document.getElementById('notification-list');
            const notifCount = document.getElementById('notification-count');
          


            if (notifCount) {
                notifCount.innerText = data.length;
                notifCount.style.display = data.length > 0 ? 'inline-block' : 'none';
            }

            notifList.innerHTML = '';

            data.forEach(notif => {
                const item = document.createElement('div');
                item.className = 'notification-item';
                
             
                if (notif.sender_type == 1) {
                    profileLink = `view_profile.php?id=${notif.sender_id}`;
                } 
               
                else if (notif.sender_type == 2) {
                    profileLink = `company_details.php?id=${notif.sender_id}`;
                }
                

                item.innerHTML = `
                    <a href="${profileLink}" class="notif-link">
                        <div style="display:flex; flex-direction:column;">
                            <strong>${notif.title}</strong>
                            <small>${notif.description}</small>
                            <span style="font-size:10px; color:gray;">${notif.created_at}</span>
                        </div>
                    </a>
                    <hr style="margin: 5px 0;">
                `;
                notifList.appendChild(item);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    loadNotifications();


});