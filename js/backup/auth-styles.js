// Modern Form Styler
(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Create and append the main style element
        const style = document.createElement('style');
        style.textContent = `
            /* Modern Form Container */
            .auth-container {
                max-width: 450px;
                width: 100%;
                margin: 0 auto;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Form Group Styling */
            .form-group {
                margin-bottom: 1.5rem;
                position: relative;
            }

            /* Form Labels */
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #fff;
                font-weight: 500;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }

            /* Input Fields */
            .form-control {
                width: 100%;
                padding: 1rem 1rem 1rem 3rem;
                font-size: 1rem;
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            /* Input Focus State */
            .form-control:focus {
                outline: none;
                border-color: #6366f1;
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
                background: rgba(255, 255, 255, 0.15);
            }

            /* Input Placeholder */
            .form-control::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            /* Input Icons */
            .input-icon {
                position: absolute;
                left: 1rem;
                top: 2.8rem;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.1rem;
                transition: all 0.3s ease;
            }

            .form-control:focus + .input-icon {
                color: #6366f1;
                transform: scale(1.1);
            }

            /* Submit Button */
            .btn-primary {
                width: 100%;
                padding: 1rem;
                border: none;
                border-radius: 12px;
                background: linear-gradient(45deg, #6366f1, #8b5cf6);
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
            }

            .btn-primary:active {
                transform: translateY(0);
            }

            .btn-primary::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: 0.5s;
            }

            .btn-primary:hover::before {
                left: 100%;
            }

            /* Toggle Link */
            .toggle-forms {
                text-align: center;
                margin-top: 1.5rem;
                color: rgba(255, 255, 255, 0.8);
                font-size: 0.95rem;
            }

            .toggle-forms a {
                color: #c7d2fe;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                position: relative;
                padding-bottom: 2px;
            }

            .toggle-forms a::after {
                content: '';
                position: absolute;
                width: 0;
                height: 2px;
                bottom: 0;
                left: 0;
                background-color: #c7d2fe;
                transition: width 0.3s ease;
            }

            .toggle-forms a:hover::after {
                width: 100%;
            }

            /* Form Toggle Animation */
            .form-container {
                position: relative;
                overflow: hidden;
                min-height: 400px;
            }

            .form-section {
                position: absolute;
                width: 100%;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateX(100%);
                visibility: hidden;
            }

            .form-section.active {
                opacity: 1;
                transform: translateX(0);
                visibility: visible;
            }

            /* Responsive Design */
            @media (max-width: 480px) {
                .auth-container {
                    padding: 1.5rem;
                    margin: 1rem;
                    width: calc(100% - 2rem);
                }

                .form-control {
                    padding: 0.8rem 0.8rem 0.8rem 2.8rem;
                }

                .input-icon {
                    left: 0.8rem;
                    top: 2.4rem;
                }
            }
        `;
        document.head.appendChild(style);

        // Add icons to form inputs
        function addIconsToInputs() {
            const inputs = document.querySelectorAll('.form-control');
            inputs.forEach(input => {
                const icon = document.createElement('i');
                icon.className = 'fas input-icon';
                
                if (input.type === 'text' && input.id.includes('username')) {
                    icon.classList.add('fa-user');
                } else if (input.type === 'email') {
                    icon.classList.add('fa-envelope');
                } else if (input.type === 'password') {
                    icon.classList.add('fa-lock');
                }
                
                input.parentNode.insertBefore(icon, input.nextSibling);
            });
        }

        // Initialize form toggle functionality
        function initFormToggle() {
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const toggleLinks = document.querySelectorAll('.toggle-form-link');
            
            // Show login form by default
            if (loginForm) loginForm.classList.add('active');
            
            // Add click handlers to toggle links
            toggleLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Toggle forms
                    if (loginForm) loginForm.classList.toggle('active');
                    if (signupForm) signupForm.classList.toggle('active');
                    
                    // Update URL hash
                    const target = this.getAttribute('href');
                    if (target === '#signup') {
                        window.location.hash = 'signup';
                    } else {
                        window.location.hash = 'login';
                    }
                });
            });
            
            // Check URL hash on load
            if (window.location.hash === '#signup') {
                if (loginForm) loginForm.classList.remove('active');
                if (signupForm) signupForm.classList.add('active');
            }
        }

        // Add floating label effect
        function initFloatingLabels() {
            const inputs = document.querySelectorAll('.form-control');
            
            inputs.forEach(input => {
                // Skip if already has a value (for page refresh)
                if (input.value) {
                    input.parentNode.classList.add('has-value');
                }
                
                input.addEventListener('focus', function() {
                    this.parentNode.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentNode.classList.remove('focused');
                    if (this.value) {
                        this.parentNode.classList.add('has-value');
                    } else {
                        this.parentNode.classList.remove('has-value');
                    }
                });
                
                // Trigger blur to set initial state
                input.dispatchEvent(new Event('blur'));
            });
        }

        // Initialize all functions
        function init() {
            // Wrap forms in containers if not already done
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            
            if (loginForm && !loginForm.classList.contains('form-section')) {
                loginForm.classList.add('form-section');
            }
            
            if (signupForm && !signupForm.classList.contains('form-section')) {
                signupForm.classList.add('form-section');
            }
            
            // Add main container class
            const container = document.querySelector('.container');
            if (container) {
                container.classList.add('auth-container');
                
                // Create form container if it doesn't exist
                let formContainer = container.querySelector('.form-container');
                if (!formContainer) {
                    formContainer = document.createElement('div');
                    formContainer.className = 'form-container';
                    
                    // Move forms into the container
                    const forms = container.querySelectorAll('form');
                    forms.forEach(form => {
                        formContainer.appendChild(form);
                    });
                    
                    container.insertBefore(formContainer, container.firstChild);
                }
            }
            
            // Initialize functionality
            addIconsToInputs();
            initFormToggle();
            initFloatingLabels();
            
            // Add animation delay to form elements
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach((group, index) => {
                group.style.transitionDelay = `${index * 0.1}s`;
            });
        }

        // Run initialization
        init();
    });
})();
