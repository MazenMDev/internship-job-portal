let current = "login";
const title = document.getElementById("title");
const form = document.getElementById("form");
const changePageH = document.getElementById("changePage");

function changePage() {
    if (current === "login") {
        document.title = "Register - JobConnect";
        title.innerText = "Join Us!";
        form.innerHTML = `
        <div class="inp reg">
            <label for="fname">First Name</label>
            <input type="text" name="fname" id="fname" placeholder="First Name" required class="holder">
        </div>
        <div class="inp reg">
            <label for="lname">Last Name</label>
            <input type="text" name="lname" id="lname" placeholder="Last Name" required class="holder">
        </div>
        <div class="inp reg">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" placeholder="example@email.com" required class="holder">
        </div>
        <div class="inp reg">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required class="holder" placeholder="At least 8 characters">
        </div>
        <div class="inp reg">
            <label for="confirm">Confirm Password</label>
            <input type="password" id="confirm" name="confirm" required class="holder" placeholder="Repeat your password">
        </div>
        <div class="inp reg gender-box">
            <label>Gender:</label>
            <div class="gender-options">
                <label><input type="radio" name="gender" value="male" required> Male</label>
                <label><input type="radio" name="gender" value="female" required> Female</label>
            </div>
        </div>
        <div class="inp">
            <input type="submit" value="Confirm" class="submit">
        </div>
        `;
        changePageH.innerHTML =
            'Already have an account? <button onclick="changePage()">Login</button>';
        current = "register";
    } else {
        document.title = "Login - JobConnect";
        title.innerText = "Welcome!";
        form.innerHTML = `
        <div class="inp" id="email-div">
            <input
                class="holder"
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                required
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="email-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
            </svg>
        </div>
        <div class="inp" id="pass-div">
            <input
                class="holder"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lock-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0 2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
            </svg>
        </div>
        <div class="inp">
            <input type="submit" value="Login" class="submit" />
        </div>
        `;
        changePageH.innerHTML =
            'Don\'t have an account? <button onclick="changePage()">Register</button>';
        current = "login";
    }
}
