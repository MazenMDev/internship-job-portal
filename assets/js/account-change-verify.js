const urlParams = new URLSearchParams(window.location.search);
const status = urlParams.get('status');
const message = urlParams.get('message');
const type = urlParams.get('type');
const token = urlParams.get('token');

const iconContainer = document.getElementById('iconContainer');
const title = document.getElementById('title');
const messageElement = document.getElementById('message');
const buttonGroup = document.getElementById('buttonGroup');
const passwordFormContainer = document.getElementById('passwordFormContainer');

if (status) {
    showResult(status, message, type);
} else if (token) {
    verifyToken(token, type);
} else {
    showResult('error', 'Invalid verification link.');
}

async function verifyToken(token, changeType) {
    try {
        const response = await fetch(`../php/verify-account-change.php?token=${token}&type=${changeType}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            if (data.change_type === 'password' && data.redirect === 'set_password') {
                showPasswordForm(token);
            } else if (data.change_type === 'email') {
                if (data.step === 'old_verified') {
                    showEmailPending(data.new_email, data.message);
                } else {
                    showResult('success', data.message, 'email');
                }
            }
        } else if (data.status === 'info') {
            showEmailPending(data.new_email, data.message);
        } else {
            showResult('error', data.message);
        }
    } catch (error) {
        showResult('error', 'An error occurred. Please try again.');
    }
}

function showResult(status, message, type = '') {
    if (status === 'success') {
        iconContainer.innerHTML = `
            <div class="success-icon">
                <svg viewBox="0 0 52 52">
                    <polyline points="14 27 22 35 38 19"/>
                </svg>
            </div>
        `;
        title.textContent = type === 'email' ? 'Email Changed!' : 'Password Changed!';
        messageElement.textContent = message || 'Your account has been updated successfully.';
        buttonGroup.innerHTML = `
            <a href="login-register.html" class="btn btn-primary">Login Now</a>
            <a href="landing.html" class="btn btn-secondary">Go to Home</a>
        `;
    } else {
        iconContainer.innerHTML = `
            <div class="error-icon">
                <svg viewBox="0 0 52 52">
                    <line x1="16" y1="16" x2="36" y2="36"/>
                    <line x1="36" y1="16" x2="16" y2="36"/>
                </svg>
            </div>
        `;
        title.textContent = 'Verification Failed';
        messageElement.textContent = message || 'There was an error processing your request.';
        buttonGroup.innerHTML = `
            <a href="landing.html" class="btn btn-primary">Go to Home</a>
        `;
    }
}

function showEmailPending(newEmail, message) {
    iconContainer.innerHTML = `
        <div class="pending-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        </div>
    `;
    title.textContent = 'Check Your New Email';
    messageElement.innerHTML = message || `A verification email has been sent to <strong>${newEmail}</strong>. Please check your inbox to complete the email change.`;
    buttonGroup.innerHTML = `
        <a href="landing.html" class="btn btn-secondary">Go to Home</a>
    `;
}

function showPasswordForm(token) {
    iconContainer.innerHTML = `
        <div class="info-icon">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
        </div>
    `;
    title.textContent = 'Set New Password';
    messageElement.textContent = 'Your identity has been verified. Please enter your new password below.';
    passwordFormContainer.style.display = 'block';
    buttonGroup.innerHTML = '';

    // Password validation
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    newPasswordInput.addEventListener('input', validatePasswordRequirements);
    
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const formError = document.getElementById('formError');
        const submitBtn = document.getElementById('submitBtn');
        
        formError.classList.remove('show');
        
        if (newPassword !== confirmPassword) {
            formError.textContent = 'Passwords do not match.';
            formError.classList.add('show');
            return;
        }
        
        if (!validatePassword(newPassword)) {
            formError.textContent = 'Password does not meet requirements.';
            formError.classList.add('show');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('new_password', newPassword);
            formData.append('confirm_password', confirmPassword);
            
            const response = await fetch('../php/complete-password-change.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                passwordFormContainer.style.display = 'none';
                showResult('success', data.message, 'password');
            } else {
                formError.textContent = data.message;
                formError.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Change Password';
            }
        } catch (error) {
            formError.textContent = 'An error occurred. Please try again.';
            formError.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Change Password';
        }
    });
}

function validatePasswordRequirements() {
    const password = document.getElementById('newPassword').value;
    
    const requirements = {
        'req-length': password.length >= 8,
        'req-upper': /[A-Z]/.test(password),
        'req-lower': /[a-z]/.test(password),
        'req-number': /[0-9]/.test(password),
        'req-special': !/[<>\/\\'"']/.test(password),
        'req-space': !/\s/.test(password)
    };
    
    for (const [id, valid] of Object.entries(requirements)) {
        const element = document.getElementById(id);
        element.classList.remove('valid', 'invalid');
        if (password.length > 0) {
            element.classList.add(valid ? 'valid' : 'invalid');
        }
    }
}

function validatePassword(password) {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password) &&
           !/[<>\/\\'"']/.test(password) &&
           !/\s/.test(password);
}
