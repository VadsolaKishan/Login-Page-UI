document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginCard = document.getElementById('loginCard');
    const mouseSpotlight = document.getElementById('mouseSpotlight');
    const loginForm = document.getElementById('loginForm');

    // Inputs & Groups
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const txtName = document.getElementById('txtName');                 // Optional for login
    const txtConfirmPassword = document.getElementById('txtConfirmPassword'); // Optional for login
    
    const groupEmail = document.getElementById('groupEmail');
    const groupPassword = document.getElementById('groupPassword');
    const groupName = document.getElementById('groupName');             // Optional for login
    const groupConfirmPassword = document.getElementById('groupConfirmPassword'); // Optional for login
    
    // Errors
    const errEmail = document.getElementById('errEmail');
    const errPassword = document.getElementById('errPassword');
    const errName = document.getElementById('errName');
    const errConfirmPassword = document.getElementById('errConfirmPassword');
    
    // Buttons & Interactivity
    const btnTogglePassword = document.getElementById('btnTogglePassword');
    const btnToggleConfirmPassword = document.getElementById('btnToggleConfirmPassword');
    const btnSubmit = document.getElementById('btnSubmit');
    const toastContainer = document.getElementById('toastContainer');
    
    // Helpers
    const chkRemember = document.getElementById('chkRemember');
    const lnkForgot = document.getElementById('lnkForgot');

    // Background Blobs
    const blob1 = document.getElementById('blob1');
    const blob2 = document.getElementById('blob2');
    const blob3 = document.getElementById('blob3');

    /* ==========================================================================
       1. Dynamic Mouse-Tracking Spotlight Effect
       ========================================================================== */
    document.body.addEventListener('mousemove', (e) => {
        const x = e.clientX + window.scrollX;
        const y = e.clientY + window.scrollY;
        
        mouseSpotlight.style.left = `${x}px`;
        mouseSpotlight.style.top = `${y}px`;
    });

    // Subtle background blob drift based on cursor movement
    document.body.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 40;
        const y = (e.clientY - window.innerHeight / 2) / 40;
        
        blob1.style.transform = `translate(${x}px, ${y}px)`;
        blob2.style.transform = `translate(${-x}px, ${-y}px)`;
        blob3.style.transform = `translate(${x * 1.5}px, ${-y * 1.5}px)`;
    });

    /* ==========================================================================
       2. Password Show/Hide Toggle
       ========================================================================== */
    function attachToggleListener(btnElement, targetInputElement) {
        if (!btnElement || !targetInputElement) return;
        btnElement.addEventListener('click', () => {
            const type = targetInputElement.getAttribute('type') === 'password' ? 'text' : 'password';
            targetInputElement.setAttribute('type', type);
            
            const openIcon = btnElement.querySelector('.icon-eye-open');
            const closedIcon = btnElement.querySelector('.icon-eye-closed');
            
            if (type === 'text') {
                openIcon.classList.add('hide');
                closedIcon.classList.remove('hide');
                btnElement.setAttribute('aria-label', 'Hide password');
            } else {
                openIcon.classList.remove('hide');
                closedIcon.classList.add('hide');
                btnElement.setAttribute('aria-label', 'Show password');
            }
        });
    }

    attachToggleListener(btnTogglePassword, txtPassword);
    attachToggleListener(btnToggleConfirmPassword, txtConfirmPassword);

    /* ==========================================================================
       3. Real-Time Form Validation
       ========================================================================== */
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateName() {
        if (!txtName || !groupName) return true; // Only apply to signup
        const val = txtName.value.trim();
        if (val === '') {
            setValidationState(groupName, errName, 'error', 'Name is required');
            return false;
        } else if (val.length < 2) {
            setValidationState(groupName, errName, 'error', 'Please enter your full name');
            return false;
        } else {
            setValidationState(groupName, errName, 'success');
            return true;
        }
    }

    function validateEmail() {
        const val = txtEmail.value.trim();
        if (val === '') {
            setValidationState(groupEmail, errEmail, 'error', 'Email address is required');
            return false;
        } else if (!emailRegex.test(val)) {
            setValidationState(groupEmail, errEmail, 'error', 'Please enter a valid email address');
            return false;
        } else {
            setValidationState(groupEmail, errEmail, 'success');
            return true;
        }
    }

    function validatePassword() {
        const val = txtPassword.value;
        if (val === '') {
            setValidationState(groupPassword, errPassword, 'error', 'Password is required');
            if (txtConfirmPassword) validateConfirmPassword(); // Trigger confirmation check
            return false;
        } else if (val.length < 6) {
            setValidationState(groupPassword, errPassword, 'error', 'Password must be at least 6 characters');
            if (txtConfirmPassword) validateConfirmPassword(); // Trigger confirmation check
            return false;
        } else {
            setValidationState(groupPassword, errPassword, 'success');
            if (txtConfirmPassword && txtConfirmPassword.value) validateConfirmPassword(); // Trigger confirmation check
            return true;
        }
    }

    function validateConfirmPassword() {
        if (!txtConfirmPassword || !groupConfirmPassword) return true; // Only apply to signup
        const val = txtConfirmPassword.value;
        if (val === '') {
            setValidationState(groupConfirmPassword, errConfirmPassword, 'error', 'Please confirm your password');
            return false;
        } else if (val !== txtPassword.value) {
            setValidationState(groupConfirmPassword, errConfirmPassword, 'error', 'Passwords do not match');
            return false;
        } else {
            setValidationState(groupConfirmPassword, errConfirmPassword, 'success');
            return true;
        }
    }

    // Helper to toggle CSS classes and error messages
    function setValidationState(groupElement, errorElement, state, customMessage = '') {
        if (state === 'success') {
            groupElement.classList.remove('error');
            groupElement.classList.add('success');
            errorElement.style.display = 'none';
        } else if (state === 'error') {
            groupElement.classList.remove('success');
            groupElement.classList.add('error');
            errorElement.textContent = customMessage;
            errorElement.style.display = 'flex';
        } else {
            groupElement.classList.remove('success', 'error');
            errorElement.style.display = 'none';
        }
    }

    // Event listeners for inline validation
    if (txtName) {
        txtName.addEventListener('input', () => {
            if (txtName.value.trim() !== '') {
                validateName();
            } else {
                setValidationState(groupName, errName, 'clear');
            }
        });
        txtName.addEventListener('blur', validateName);
    }

    txtEmail.addEventListener('input', () => {
        if (txtEmail.value.trim() !== '') {
            validateEmail();
        } else {
            setValidationState(groupEmail, errEmail, 'clear');
        }
    });

    txtPassword.addEventListener('input', () => {
        if (txtPassword.value !== '') {
            validatePassword();
        } else {
            setValidationState(groupPassword, errPassword, 'clear');
        }
    });

    if (txtConfirmPassword) {
        txtConfirmPassword.addEventListener('input', () => {
            if (txtConfirmPassword.value !== '') {
                validateConfirmPassword();
            } else {
                setValidationState(groupConfirmPassword, errConfirmPassword, 'clear');
            }
        });
        txtConfirmPassword.addEventListener('blur', validateConfirmPassword);
    }

    txtEmail.addEventListener('blur', validateEmail);
    txtPassword.addEventListener('blur', validatePassword);

    /* ==========================================================================
       4. Reusable Toast Notification System
       ========================================================================== */
    function showToast(title, message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Define SVG icon based on toast type
        const iconSvg = type === 'success' 
            ? `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
               </svg>`
            : `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
               </svg>`;
               
        toast.innerHTML = `
            <div class="toast-icon">${iconSvg}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Force reflow and show
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto-destroy toast
        setTimeout(() => {
            toast.classList.remove('show');
            // Remove from DOM after CSS transition completes
            toast.addEventListener('transitionend', () => toast.remove());
        }, 4000);
    }

    /* ==========================================================================
       5. Form Submission Handling
       ========================================================================== */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Perform final check
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        const isSignup = !!txtName;
        
        if (!isEmailValid || !isPasswordValid || (isSignup && (!isNameValid || !isConfirmPasswordValid))) {
            // Trigger physical card shake feedback on failed submission
            loginCard.classList.add('shake');
            showToast('Validation Failed', 'Please review the fields in red.', 'error');
            
            // Remove shake class after animation completes
            setTimeout(() => {
                loginCard.classList.remove('shake');
            }, 400);
            return;
        }

        // Show button loading spinner and disable UI interactions
        btnSubmit.classList.add('loading');
        btnSubmit.disabled = true;
        if(txtName) txtName.disabled = true;
        txtEmail.disabled = true;
        txtPassword.disabled = true;
        if(txtConfirmPassword) txtConfirmPassword.disabled = true;
        
        // Simulate remote authentication API delay
        setTimeout(() => {
            // Reset loader state
            btnSubmit.classList.remove('loading');
            btnSubmit.disabled = false;
            if(txtName) txtName.disabled = false;
            txtEmail.disabled = false;
            txtPassword.disabled = false;
            if(txtConfirmPassword) txtConfirmPassword.disabled = false;
            
            // Successfully processed!
            if (isSignup) {
                showToast('Account Created', 'Registration successful. Redirecting to workspace...', 'success');
            } else {
                showToast('Welcome to Portal', 'Authentication successful. Redirecting you...', 'success');
            }
            
            // Reset form input values
            loginForm.reset();
            if(groupName) setValidationState(groupName, errName, 'clear');
            setValidationState(groupEmail, errEmail, 'clear');
            setValidationState(groupPassword, errPassword, 'clear');
            if(groupConfirmPassword) setValidationState(groupConfirmPassword, errConfirmPassword, 'clear');
            
        }, 1800);
    });

    // Handle social logins mock response
    const btnGoogle = document.getElementById('btnGoogle');
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            showToast('Google Federated Access', 'Connecting to Google Authentication Services...', 'success');
        });
    }
    
    const btnGithub = document.getElementById('btnGithub');
    if (btnGithub) {
        btnGithub.addEventListener('click', () => {
            showToast('GitHub SSO Authentication', 'Connecting to GitHub Identity Provider...', 'success');
        });
    }

    if (lnkForgot) {
        lnkForgot.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Recovery Requested', 'Password reset instructions have been queued.', 'success');
        });
    }
});
