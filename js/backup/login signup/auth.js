document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleSignup = document.getElementById('toggle-signup');
    const messageContainer = document.getElementById('message-container');
    
    // Toggle between login and signup forms
    if (toggleLogin && toggleSignup) {
        toggleLogin.addEventListener('click', () => toggleForms(false));
        toggleSignup.addEventListener('click', () => toggleForms(true));
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Real-time password matching for signup
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    
    if (passwordInput && confirmPasswordInput) {
        [passwordInput, confirmPasswordInput].forEach(input => {
            input.addEventListener('input', validatePasswords);
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value;
            
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        username: email, // Using email as username
                        password 
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed. Please check your credentials.');
                }
                
                // Store the token and user data
                localStorage.setItem('token', data.data.token);
                if (data.data) {
                    localStorage.setItem('user', JSON.stringify({
                        id: data.data.id,
                        username: data.data.username,
                        email: data.data.email
                    }));
                }
                
                showSuccessMessage('Login successful! Redirecting...', '/feed');
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message || 'Login failed. Please try again.');
            }
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signup-username')?.value.trim();
            const email = document.getElementById('signup-email')?.value.trim();
            const password = document.getElementById('signup-password')?.value;
            const confirmPassword = document.getElementById('signup-confirm-password')?.value;
            
            // Validation
            if (!username || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ 
                        username, 
                        email, 
                        password,
                        deviceId: generateUUID()
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed. Please try again.');
                }
                
                // Store the token and user data
                localStorage.setItem('token', data.data.token);
                if (data.data) {
                    localStorage.setItem('user', JSON.stringify({
                        id: data.data.id,
                        username: data.data.username,
                        email: data.data.email
                    }));
                }
                
                showSuccessMessage('Registration successful! Redirecting...', '/feed');
            } catch (error) {
                console.error('Signup error:', error);
                showError(error.message || 'Registration failed. Please try again.');
            }
        });
    }

    // Helper Functions
    function toggleForms(showSignup) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const toggleIndicator = document.querySelector('.toggle-indicator');
        
        if (showSignup) {
            loginForm.classList.remove('form-active');
            signupForm.classList.add('form-active');
            toggleIndicator.style.transform = 'translateX(100%)';
            document.getElementById('toggle-login').classList.remove('active');
            document.getElementById('toggle-signup').classList.add('active');
        } else {
            signupForm.classList.remove('form-active');
            loginForm.classList.add('form-active');
            toggleIndicator.style.transform = 'translateX(0)';
            document.getElementById('toggle-signup').classList.remove('active');
            document.getElementById('toggle-login').classList.add('active');
        }
    }

    function validatePasswords() {
        const password = document.getElementById('signup-password')?.value;
        const confirmPassword = document.getElementById('signup-confirm-password')?.value;
        
        if (!password || !confirmPassword) return;
        
        const passwordMatch = password === confirmPassword;
        const confirmPasswordInput = document.getElementById('signup-confirm-password');
        
        if (confirmPasswordInput) {
            if (confirmPassword && !passwordMatch) {
                confirmPasswordInput.setCustomValidity("Passwords don't match");
            } else {
                confirmPasswordInput.setCustomValidity("");
            }
        }
    }

    function showError(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button class="close-btn" aria-label="Close">&times;</button>
        `;
        
        messageContainer.appendChild(messageDiv);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
        
        // Close button functionality
        const closeBtn = messageDiv.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            });
        }
    }

    function showSuccessMessage(message, redirectUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message success';
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button class="close-btn" aria-label="Close">&times;</button>
        `;
        
        messageContainer.appendChild(messageDiv);
        
        // Auto-remove message after 5 seconds
        const removeMessage = () => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
            
            if (redirectUrl) {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            }
        };
        
        setTimeout(removeMessage, 5000);
        
        // Close button functionality
        const closeBtn = messageDiv.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', removeMessage);
        }
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});
