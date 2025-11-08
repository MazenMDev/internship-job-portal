closeSideBar = document.getElementById('closeSideBar');
closeSideBar.addEventListener('click', function() {
    const adminAside = document.getElementById('adminAside');
    if (adminAside.style.display === 'none') {
        adminAside.style.display = 'block';
        closeSideBar.style.backgroundColor = 'var(--box-color)';
        closeSideBar.style.color = 'var(--text-color)';
        closeSideBar.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-x-icon lucide-x"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>`;

      document.getElementById('adminPanel').style.marginLeft = '240px';
    } else {
        closeSideBar.style.backgroundColor = 'var(--primary-color)';
        closeSideBar.style.color = '#fff';
        adminAside.style.display = 'none';
        closeSideBar.innerHTML = `    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-menu-icon lucide-menu"
    >
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>`;
    
      document.getElementById('adminPanel').style.marginLeft = '0';
    }
});