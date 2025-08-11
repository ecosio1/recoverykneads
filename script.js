// Recovery Kneads Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle with Accessibility
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            this.classList.toggle('active'); // Add this for hamburger animation
            
            // Announce state change to screen readers
            if (!isExpanded) {
                this.setAttribute('aria-label', 'Close mobile navigation');
                // Focus first menu item when opened
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            } else {
                this.setAttribute('aria-label', 'Toggle mobile navigation');
            }
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active'); // Add this for hamburger animation
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Toggle mobile navigation');
                hamburger.focus();
            }
        });
        
        // Keyboard navigation for menu items
        navMenu.addEventListener('keydown', function(e) {
            const menuItems = this.querySelectorAll('a');
            const currentIndex = Array.from(menuItems).indexOf(document.activeElement);
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % menuItems.length;
                menuItems[nextIndex].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                menuItems[prevIndex].focus();
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize the embedded booking form
    showDirectBookingOption();
    
    // Enhanced navbar scroll effects
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 6px 40px rgba(139, 74, 59, 0.15), 0 2px 8px rgba(244, 168, 124, 0.1)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 32px rgba(139, 74, 59, 0.12), 0 2px 8px rgba(244, 168, 124, 0.1)';
            navbar.classList.remove('scrolled');
        }
    });
    
    // Enhanced animation on scroll with staggered effects and accessibility
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = prefersReducedMotion ? 0 : index * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    if (!prefersReducedMotion) {
                        entry.target.classList.add('fade-in-up');
                    }
                }, delay); // Staggered animation delay only if motion is allowed
            }
        });
    }, observerOptions);
    
    // Enhanced element observation with different animation classes
    document.querySelectorAll('.service-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
    
    document.querySelectorAll('.testimonial-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });
    
    document.querySelectorAll('.about-text, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Function to submit appointment request
function submitAppointment(appointmentData) {
    // Show loading state
    const submitButton = document.querySelector('#appointmentForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Create email content
    const emailSubject = 'New Appointment Request - Recovery Kneads';
    const emailBody = `
New Appointment Request

Name: ${appointmentData.name}
Email: ${appointmentData.email}
Phone: ${appointmentData.phone}
Service: ${appointmentData.service}
Date: ${appointmentData.date}
Time: ${appointmentData.time}
Notes: ${appointmentData.notes || 'None'}

Please contact the client to confirm this appointment.
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:massagebyerikag@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Simulate processing delay
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('appointmentForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Log the appointment data
        console.log('Appointment request submitted:', appointmentData);
        
        // Optionally open email client (uncomment if you want this)
        // window.open(mailtoLink, '_blank');
        
    }, 1500);
}

// Function to show success message
function showSuccessMessage() {
    // Remove existing success message if any
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <strong>Thank you!</strong> Your appointment request has been submitted successfully. 
        We'll contact you within 24 hours to confirm your appointment and discuss payment options.
        <br><br>
        <small>If you need immediate assistance, please call us at (239) 427-4757</small>
    `;
    
    // Insert before the form
    const form = document.querySelector('.appointment-form');
    if (form) {
        form.insertBefore(successDiv, form.firstChild);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 5000);
    
    // Scroll to the success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Service selection handler (optional - for dynamic pricing display)
document.addEventListener('change', function(e) {
    if (e.target.id === 'service') {
        const selectedService = e.target.value;
        // You could show additional information based on the selected service
        // For example, display duration, price, or special instructions
        console.log('Selected service:', selectedService);
    }
});

// Time slot availability checker (placeholder)
function checkTimeAvailability(date, time) {
    // In a real implementation, this would check against your booking system
    // to see if the requested time slot is available
    
    // For demo purposes, let's say Mondays at 2 PM are unavailable
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    if (dayOfWeek === 1 && time === '14:00') { // Monday at 2 PM
        return false;
    }
    
    return true;
}

// Form enhancement: Real-time availability checking
document.addEventListener('change', function(e) {
    if (e.target.id === 'date' || e.target.id === 'time') {
        const dateValue = document.getElementById('date').value;
        const timeValue = document.getElementById('time').value;
        
        if (dateValue && timeValue) {
            if (!checkTimeAvailability(dateValue, timeValue)) {
                alert('Sorry, that time slot is not available. Please choose a different time.');
                document.getElementById('time').value = '';
            }
        }
    }
});

// Contact form placeholder (if you add one later)
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle contact form submission
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
        });
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactForm);

// Utility function for formatting phone numbers as user types
function formatPhoneNumber(value) {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) {
        return phoneNumber;
    } else if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
}

// Apply phone formatting to phone input
document.addEventListener('input', function(e) {
    if (e.target.id === 'phone') {
        e.target.value = formatPhoneNumber(e.target.value);
    }
});

// Enhanced Calendar-style booking system with Square Appointments preparation
function showDirectBookingOption() {
    const widgetContainer = document.getElementById('square-appointments-widget');
    if (widgetContainer) {
        // Check if Square Appointments is available
        if (window.Square && window.Square.Appointments) {
            initializeSquareAppointments();
            return;
        }
        // Use the enhanced custom booking system
        showCustomBookingSystem();
    }
}

// Calendar booking system functionality
let currentBooking = {
    service: null,
    serviceData: null,
    date: null,
    time: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
};

function initCalendarBooking() {
    // Service selection
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selection
            document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            this.classList.add('selected');
            
            // Store service data
            currentBooking.service = this.dataset.service;
            currentBooking.serviceData = {
                name: this.querySelector('h4').textContent,
                description: this.querySelector('p').textContent,
                duration: this.dataset.duration,
                price: this.dataset.price
            };
            
            // Enable continue button
            document.querySelector('.step-1 .continue-btn').disabled = false;
        });
    });
    
    // Initialize calendar
    initCalendar();
    
    // Step navigation
    setupStepNavigation();
    
    // Form submission
    setupFormSubmission();
}

function initCalendar() {
    renderCalendar();
    
    // Month navigation
    document.querySelector('.prev-month').addEventListener('click', () => {
        currentBooking.currentMonth--;
        if (currentBooking.currentMonth < 0) {
            currentBooking.currentMonth = 11;
            currentBooking.currentYear--;
        }
        renderCalendar();
    });
    
    document.querySelector('.next-month').addEventListener('click', () => {
        currentBooking.currentMonth++;
        if (currentBooking.currentMonth > 11) {
            currentBooking.currentMonth = 0;
            currentBooking.currentYear++;
        }
        renderCalendar();
    });
}

function renderCalendar() {
    const today = new Date();
    const firstDay = new Date(currentBooking.currentYear, currentBooking.currentMonth, 1);
    const lastDay = new Date(currentBooking.currentYear, currentBooking.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Update calendar title
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('.calendar-title').textContent = 
        `${monthNames[currentBooking.currentMonth]} ${currentBooking.currentYear}`;
    
    // Render calendar days
    const calendarDays = document.querySelector('.calendar-days');
    calendarDays.innerHTML = '';
    
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = currentDate.getDate();
        
        // Check if date is in current month
        if (currentDate.getMonth() !== currentBooking.currentMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Check if date is in the past
        if (currentDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('past-date');
        }
        
        // Check if it's Sunday (closed)
        if (currentDate.getDay() === 0) {
            dayElement.classList.add('closed');
            dayElement.title = 'Closed on Sundays';
        }
        
        // Add click event for future dates that aren't Sunday
        if (currentDate >= today && currentDate.getDay() !== 0 && currentDate.getMonth() === currentBooking.currentMonth) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(currentDate, dayElement));
        }
        
        calendarDays.appendChild(dayElement);
    }
}

function selectDate(date, dayElement) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day').forEach(day => day.classList.remove('selected'));
    
    // Add selection to clicked day
    dayElement.classList.add('selected');
    
    // Store selected date
    currentBooking.date = date;
    
    // Generate time slots
    generateTimeSlots(date);
}

function generateTimeSlots(date) {
    const timeSlotsContainer = document.querySelector('.time-slots');
    timeSlotsContainer.innerHTML = '';
    
    // Define business hours based on day of week
    let startHour, endHour;
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        startHour = 9;
        endHour = 19; // 7 PM
    } else if (dayOfWeek === 6) { // Saturday
        startHour = 9;
        endHour = 17; // 5 PM
    } else { // Sunday - closed
        timeSlotsContainer.innerHTML = '<p class="closed-message">Closed on Sundays</p>';
        return;
    }
    
    // Generate time slots (every hour)
    for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = document.createElement('button');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = formatTime(hour);
        timeSlot.dataset.time = hour;
        
        // Randomly mark some slots as unavailable for demo
        const isAvailable = Math.random() > 0.3; // 70% chance of availability
        
        if (isAvailable) {
            timeSlot.classList.add('available');
            timeSlot.addEventListener('click', () => selectTimeSlot(hour, timeSlot));
        } else {
            timeSlot.classList.add('unavailable');
            timeSlot.disabled = true;
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    }
}

function formatTime(hour) {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
}

function selectTimeSlot(hour, timeSlotElement) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    
    // Add selection to clicked slot
    timeSlotElement.classList.add('selected');
    
    // Store selected time
    currentBooking.time = hour;
    
    // Enable continue button
    document.querySelector('.step-2 .continue-btn').disabled = false;
}

function setupStepNavigation() {
    // Continue buttons
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.booking-step');
            const stepNumber = Array.from(currentStep.parentElement.children).indexOf(currentStep) + 1;
            
            if (stepNumber === 1) {
                // Moving from service to calendar
                goToStep(2);
            } else if (stepNumber === 2) {
                // Moving from calendar to details
                updateBookingSummary();
                goToStep(3);
            }
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = this.closest('.booking-step');
            const stepNumber = Array.from(currentStep.parentElement.children).indexOf(currentStep) + 1;
            
            if (stepNumber === 2) {
                goToStep(1);
            } else if (stepNumber === 3) {
                goToStep(2);
            }
        });
    });
}

function goToStep(stepNumber) {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide step content
    document.querySelectorAll('.booking-step').forEach((step, index) => {
        if (index + 1 === stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function updateBookingSummary() {
    if (currentBooking.serviceData) {
        document.querySelector('.selected-service').textContent = currentBooking.serviceData.name;
        document.querySelector('.selected-duration').textContent = currentBooking.serviceData.duration;
        document.querySelector('.selected-price').textContent = currentBooking.serviceData.price;
    }
    
    if (currentBooking.date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.querySelector('.selected-date').textContent = currentBooking.date.toLocaleDateString('en-US', options);
    }
    
    if (currentBooking.time !== null) {
        document.querySelector('.selected-time').textContent = formatTime(currentBooking.time);
    }
}

function setupFormSubmission() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors();
            
            // Get form data
            const formData = new FormData(this);
            const appointmentData = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                phone: formData.get('phone')?.trim(),
                service: currentBooking.serviceData.name,
                date: currentBooking.date.toLocaleDateString(),
                time: formatTime(currentBooking.time),
                duration: currentBooking.serviceData.duration,
                price: currentBooking.serviceData.price,
                notes: formData.get('notes')?.trim(),
                newClient: formData.get('new-client') === 'on',
                consent: formData.get('consent') === 'on'
            };
            
            // Enhanced form validation
            let isValid = true;
            
            // Name validation
            if (!appointmentData.name || appointmentData.name.length < 2) {
                showFieldError('name', 'Please enter your full name (at least 2 characters)');
                isValid = false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!appointmentData.email) {
                showFieldError('email', 'Email address is required');
                isValid = false;
            } else if (!emailRegex.test(appointmentData.email)) {
                showFieldError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation (enhanced)
            const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
            if (!appointmentData.phone) {
                showFieldError('phone', 'Phone number is required');
                isValid = false;
            } else if (!phoneRegex.test(appointmentData.phone.replace(/\D/g, ''))) {
                showFieldError('phone', 'Please enter a valid 10-digit phone number');
                isValid = false;
            }
            
            // Consent validation
            if (!appointmentData.consent) {
                alert('Please review and accept our privacy policy to continue.');
                isValid = false;
            }
            
            if (!isValid) {
                // Focus on first error field
                const firstError = document.querySelector('.error-message.show');
                if (firstError) {
                    const fieldId = firstError.id.replace('-error', '');
                    document.getElementById(fieldId)?.focus();
                }
                return;
            }
            
            // Submit the appointment
            submitEnhancedAppointment(appointmentData);
        });
        
        // Real-time validation
        setupRealTimeValidation();
    }
}
    
    // Apply phone formatting
    setTimeout(() => {
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                e.target.value = formatPhoneNumber(e.target.value);
            });
        }
    }, 100);
}

// Square Appointments Integration
function initializeSquareAppointments() {
    const widgetContainer = document.getElementById('square-appointments-widget');
    
    // Show Square Appointments widget with fallback
    widgetContainer.innerHTML = `
        <div class="square-appointments-embed">
            <div class="square-loading">
                <div class="loading-spinner"></div>
                <p>Loading appointment calendar...</p>
            </div>
            <!-- Square Appointments embed will replace this content -->
            <!-- Integration instructions: 
                 1. Replace YOUR_APPLICATION_ID with your Square Application ID
                 2. Replace YOUR_LOCATION_ID with your Square Location ID
                 3. Test in sandbox first, then switch to production
            -->
            <script>
                // Square Appointments Widget Configuration
                window.addEventListener('load', function() {
                    if (window.Square && window.Square.Appointments) {
                        window.Square.Appointments.render({
                            applicationId: 'YOUR_APPLICATION_ID', // Replace with actual Application ID
                            locationId: 'YOUR_LOCATION_ID', // Replace with actual Location ID
                            environment: 'sandbox', // Change to 'production' when ready
                            elementId: 'square-appointments-widget',
                            styles: {
                                primaryColor: '#f4a87c',
                                secondaryColor: '#e8906b',
                                fontFamily: 'Open Sans, sans-serif'
                            }
                        });
                    } else {
                        // Fallback to custom booking system
                        console.warn('Square Appointments not available, using fallback booking system');
                        showCustomBookingSystem();
                    }
                });
            </script>
        </div>
        <div class="booking-fallback">
            <div class="fallback-options">
                <h4>Alternative Booking Options</h4>
                <div class="fallback-buttons">
                    <a href="tel:+12394274757" class="btn-primary">
                        <span>📞 Call Now</span>
                        <small>(239) 427-4757</small>
                    </a>
                    <a href="mailto:massagebyerikag@gmail.com?subject=Appointment Request" class="btn-secondary">
                        <span>✉️ Email Us</span>
                        <small>Quick Response</small>
                    </a>
                </div>
                <p class="fallback-text">Prefer to book directly? Call or email us and we'll get you scheduled within 24 hours.</p>
            </div>
        </div>
    `;
}

// Enhanced custom booking system (fallback)
function showCustomBookingSystem() {
    const widgetContainer = document.getElementById('square-appointments-widget');
    const customBookingHTML = generateCustomBookingHTML();
    widgetContainer.innerHTML = customBookingHTML;
    initCalendarBooking();
}

// Generate the enhanced booking HTML
function generateCustomBookingHTML() {
    return `
        <div class="calendar-booking-container">
            <!-- Progress Steps with Enhanced Design -->
            <div class="booking-steps">
                <div class="step active" data-step="1">
                    <span class="step-number">1</span>
                    <span class="step-label">Service</span>
                    <div class="step-connector"></div>
                </div>
                <div class="step" data-step="2">
                    <span class="step-number">2</span>
                    <span class="step-label">Date & Time</span>
                    <div class="step-connector"></div>
                </div>
                <div class="step" data-step="3">
                    <span class="step-number">3</span>
                    <span class="step-label">Your Details</span>
                </div>
            </div>

            <!-- Step 1: Enhanced Service Selection -->
            <div class="booking-step step-1 active">
                <div class="step-header">
                    <h3>Choose Your Healing Journey</h3>
                    <p>Select the service that best addresses your needs</p>
                </div>
                <div class="service-options">
                    <div class="service-option" data-service="therapeutic-60" data-duration="60" data-price="80" role="button" tabindex="0" aria-describedby="therapeutic-60-desc">
                        <div class="service-info">
                            <div class="service-icon">🤲</div>
                            <div class="service-details">
                                <h4>Therapeutic Massage</h4>
                                <p id="therapeutic-60-desc">60 minutes - Perfect for stress relief and overall wellness</p>
                                <div class="service-features">
                                    <span class="feature-tag">Stress Relief</span>
                                    <span class="feature-tag">Relaxation</span>
                                    <span class="feature-tag">Wellness</span>
                                </div>
                            </div>
                        </div>
                        <div class="service-price">
                            <span class="price">$80</span>
                            <small>60 min</small>
                        </div>
                    </div>
                    
                    <div class="service-option" data-service="therapeutic-90" data-duration="90" data-price="120" role="button" tabindex="0" aria-describedby="therapeutic-90-desc">
                        <div class="service-info">
                            <div class="service-icon">🤲</div>
                            <div class="service-details">
                                <h4>Therapeutic Massage</h4>
                                <p id="therapeutic-90-desc">90 minutes - Extended session for deeper wellness</p>
                                <div class="service-features">
                                    <span class="feature-tag">Extended Session</span>
                                    <span class="feature-tag">Deep Relaxation</span>
                                    <span class="feature-tag">Comprehensive</span>
                                </div>
                            </div>
                        </div>
                        <div class="service-price">
                            <span class="price">$120</span>
                            <small>90 min</small>
                        </div>
                    </div>
                    
                    <div class="service-option featured" data-service="deep-tissue-60" data-duration="60" data-price="85" role="button" tabindex="0" aria-describedby="deep-tissue-60-desc">
                        <div class="popular-badge">Most Popular</div>
                        <div class="service-info">
                            <div class="service-icon">💪</div>
                            <div class="service-details">
                                <h4>Deep Tissue Massage</h4>
                                <p id="deep-tissue-60-desc">60 minutes - Targeted therapy for chronic pain relief</p>
                                <div class="service-features">
                                    <span class="feature-tag">Pain Relief</span>
                                    <span class="feature-tag">Tension Release</span>
                                    <span class="feature-tag">Therapeutic</span>
                                </div>
                            </div>
                        </div>
                        <div class="service-price">
                            <span class="price">$85</span>
                            <small>60 min</small>
                        </div>
                    </div>
                    
                    <div class="service-option" data-service="deep-tissue-90" data-duration="90" data-price="125" role="button" tabindex="0" aria-describedby="deep-tissue-90-desc">
                        <div class="service-info">
                            <div class="service-icon">💪</div>
                            <div class="service-details">
                                <h4>Deep Tissue Massage</h4>
                                <p id="deep-tissue-90-desc">90 minutes - Comprehensive pain relief session</p>
                                <div class="service-features">
                                    <span class="feature-tag">Chronic Pain</span>
                                    <span class="feature-tag">Extended Relief</span>
                                    <span class="feature-tag">Comprehensive</span>
                                </div>
                            </div>
                        </div>
                        <div class="service-price">
                            <span class="price">$125</span>
                            <small>90 min</small>
                        </div>
                    </div>
                    
                    <div class="service-option" data-service="sports-60" data-duration="60" data-price="85" role="button" tabindex="0" aria-describedby="sports-60-desc">
                        <div class="service-info">
                            <div class="service-icon">⚡</div>
                            <div class="service-details">
                                <h4>Sports Massage</h4>
                                <p id="sports-60-desc">60 minutes - For athletes and active individuals</p>
                                <div class="service-features">
                                    <span class="feature-tag">Performance</span>
                                    <span class="feature-tag">Recovery</span>
                                    <span class="feature-tag">Athletic</span>
                                </div>
                            </div>
                        </div>
                        <div class="service-price">
                            <span class="price">$85</span>
                            <small>60 min</small>
                        </div>
                    </div>
                </div>
                <div class="step-navigation">
                    <button class="btn-primary continue-btn" disabled aria-label="Continue to date and time selection">
                        Continue to Date & Time
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Step 2: Enhanced Calendar and Time Selection -->
            <div class="booking-step step-2">
                <div class="step-header">
                    <h3>Select Your Preferred Date & Time</h3>
                    <p>Choose from available appointments that work with your schedule</p>
                </div>
                <div class="calendar-time-container">
                    <div class="calendar-container">
                        <div class="calendar-header">
                            <button class="calendar-nav prev-month" aria-label="Previous month" type="button">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <h4 class="calendar-title" role="heading" aria-level="4"></h4>
                            <button class="calendar-nav next-month" aria-label="Next month" type="button">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div class="calendar-grid">
                            <div class="calendar-days-header" role="row">
                                <div class="day-header" role="columnheader">Sun</div>
                                <div class="day-header" role="columnheader">Mon</div>
                                <div class="day-header" role="columnheader">Tue</div>
                                <div class="day-header" role="columnheader">Wed</div>
                                <div class="day-header" role="columnheader">Thu</div>
                                <div class="day-header" role="columnheader">Fri</div>
                                <div class="day-header" role="columnheader">Sat</div>
                            </div>
                            <div class="calendar-days" role="grid" aria-label="Calendar dates"></div>
                        </div>
                        <div class="calendar-legend">
                            <div class="legend-item">
                                <span class="legend-color available"></span>
                                <span>Available</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color limited"></span>
                                <span>Limited slots</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color unavailable"></span>
                                <span>Unavailable</span>
                            </div>
                        </div>
                    </div>
                    <div class="time-slots-container">
                        <div class="time-header">
                            <h4>Available Times</h4>
                            <div class="business-hours">
                                <p>Mon-Fri: 9AM-7PM</p>
                                <p>Sat: 9AM-5PM</p>
                                <p>Sun: Closed</p>
                            </div>
                        </div>
                        <div class="time-slots" role="listbox" aria-label="Available appointment times">
                            <p class="select-date-message">Please select a date to view available times</p>
                        </div>
                    </div>
                </div>
                <div class="step-navigation">
                    <button class="btn-secondary back-btn" type="button">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Back to Services
                    </button>
                    <button class="btn-primary continue-btn" disabled aria-label="Continue to booking details">
                        Continue to Details
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Step 3: Enhanced Contact Information -->
            <div class="booking-step step-3">
                <div class="step-header">
                    <h3>Complete Your Booking</h3>
                    <p>Just a few details and you're all set for your healing session</p>
                </div>
                <div class="booking-content">
                    <div class="booking-summary">
                        <h4>Booking Summary</h4>
                        <div class="summary-details">
                            <div class="summary-item">
                                <span class="label">Service:</span>
                                <span class="value selected-service"></span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Date:</span>
                                <span class="value selected-date"></span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Time:</span>
                                <span class="value selected-time"></span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Duration:</span>
                                <span class="value"><span class="selected-duration"></span> minutes</span>
                            </div>
                            <div class="summary-item total">
                                <span class="label">Total:</span>
                                <span class="value">$<span class="selected-price"></span></span>
                            </div>
                        </div>
                        <div class="payment-info">
                            <p><strong>Payment Options:</strong> Cash, Card, HSA/FSA, Select Insurance</p>
                            <p><small>Payment is collected at the time of your appointment</small></p>
                        </div>
                    </div>
                    <form id="appointmentForm" class="appointment-form" novalidate>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="name">Full Name <span class="required">*</span></label>
                                <input type="text" id="name" name="name" required aria-describedby="name-error" autocomplete="name">
                                <div class="error-message" id="name-error" role="alert"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email Address <span class="required">*</span></label>
                                <input type="email" id="email" name="email" required aria-describedby="email-error" autocomplete="email">
                                <div class="error-message" id="email-error" role="alert"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number <span class="required">*</span></label>
                                <input type="tel" id="phone" name="phone" required aria-describedby="phone-error" autocomplete="tel">
                                <div class="error-message" id="phone-error" role="alert"></div>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="new-client" name="new-client">
                                    <span class="checkmark"></span>
                                    This is my first visit
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="notes">Special Requests or Health Information</label>
                            <textarea id="notes" name="notes" rows="4" placeholder="Please share any areas of concern, health conditions, allergies, or special requests that would help us provide the best care for you..." aria-describedby="notes-help"></textarea>
                            <div class="help-text" id="notes-help">
                                <small>All information is kept confidential and helps us provide personalized care</small>
                            </div>
                        </div>
                        
                        <div class="privacy-consent">
                            <label class="checkbox-label required">
                                <input type="checkbox" id="consent" name="consent" required>
                                <span class="checkmark"></span>
                                <span>I consent to the collection and use of my personal information for appointment scheduling and communication purposes. <a href="#privacy" class="privacy-link">Privacy Policy</a></span>
                            </label>
                        </div>
                        
                        <div class="step-navigation">
                            <button type="button" class="btn-secondary back-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Back to Date & Time
                            </button>
                            <button type="submit" class="btn-primary submit-btn">
                                <span class="btn-text">Book Your Appointment</span>
                                <div class="btn-loader" style="display: none;">
                                    <div class="spinner"></div>
                                    <span>Processing...</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Success Message Template -->
            <div class="booking-step step-success" style="display: none;">
                <div class="success-content">
                    <div class="success-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="20" fill="#f4a87c"/>
                            <path d="M16 24L22 30L32 18" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h3>Booking Request Submitted!</h3>
                    <p>Thank you for choosing Recovery Kneads. We'll contact you within 24 hours to confirm your appointment and discuss any questions you may have.</p>
                    <div class="next-steps">
                        <h4>What Happens Next?</h4>
                        <ul>
                            <li>We'll call or email to confirm your appointment time</li>
                            <li>You'll receive preparation instructions if needed</li>
                            <li>Arrive 10 minutes early for your wellness assessment</li>
                        </ul>
                    </div>
                    <div class="contact-options">
                        <p><strong>Questions? Contact us directly:</strong></p>
                        <a href="tel:+12394274757" class="contact-link">📞 (239) 427-4757</a>
                        <a href="mailto:massagebyerikag@gmail.com" class="contact-link">✉️ massagebyerikag@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Enhanced form validation functions
function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.classList.remove('error');
    });
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Add error styling to field
        field.style.borderColor = '#e63946';
        field.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
        
        // Remove error styling when user starts typing
        field.addEventListener('input', function() {
            this.classList.remove('error');
            this.style.borderColor = '';
            this.style.boxShadow = '';
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }, { once: true });
    }
}

function setupRealTimeValidation() {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    
    // Name validation
    if (nameField) {
        nameField.addEventListener('blur', function() {
            if (this.value.trim().length > 0 && this.value.trim().length < 2) {
                showFieldError('name', 'Name must be at least 2 characters');
            }
        });
    }
    
    // Email validation
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value.trim() && !emailRegex.test(this.value.trim())) {
                showFieldError('email', 'Please enter a valid email address');
            }
        });
    }
    
    // Phone validation and formatting
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            // Format phone number as user types
            const formatted = formatPhoneNumber(e.target.value);
            e.target.value = formatted;
        });
        
        phoneField.addEventListener('blur', function() {
            const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
            const cleanPhone = this.value.replace(/\D/g, '');
            if (this.value && (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone))) {
                showFieldError('phone', 'Please enter a valid 10-digit phone number');
            }
        });
    }
}

// Enhanced appointment submission with loading states
function submitEnhancedAppointment(appointmentData) {
    const submitButton = document.querySelector('.submit-btn');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitButton.disabled = true;
    
    // Prepare email content with enhanced formatting
    const emailSubject = `New Appointment Request - ${appointmentData.service}`;
    const clientType = appointmentData.newClient ? 'New Client' : 'Returning Client';
    
    const emailBody = `
🏥 NEW APPOINTMENT REQUEST

📋 APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: ${appointmentData.service}
Duration: ${appointmentData.duration} minutes
Date: ${appointmentData.date}
Time: ${appointmentData.time}
Price: $${appointmentData.price}

👤 CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${appointmentData.name}
Email: ${appointmentData.email}
Phone: ${appointmentData.phone}
Client Type: ${clientType}

📝 SPECIAL REQUESTS/NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${appointmentData.notes || 'None provided'}

⚠️ BOOKING PRIORITY: High (Online Booking)
📅 Submitted: ${new Date().toLocaleString()}

Please contact the client within 24 hours to confirm.
    `.trim();
    
    // Create mailto link
    const mailtoLink = `mailto:massagebyerikag@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Simulate processing time and show success
    setTimeout(() => {
        // Show success step
        showSuccessStep(appointmentData);
        
        // Reset form state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitButton.disabled = false;
        
        // Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'appointment_request', {
                'event_category': 'booking',
                'event_label': appointmentData.service,
                'value': parseInt(appointmentData.price)
            });
        }
        
        // Log for debugging
        console.log('Enhanced appointment request submitted:', appointmentData);
        
        // Open email client (optional)
        // window.open(mailtoLink, '_blank');
        
    }, 2000);
}

function showSuccessStep(appointmentData) {
    // Hide all other steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show success step
    const successStep = document.querySelector('.step-success');
    if (successStep) {
        successStep.style.display = 'block';
        successStep.classList.add('active');
        
        // Scroll to top of booking container
        const bookingContainer = document.querySelector('.calendar-booking-container');
        if (bookingContainer) {
            bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('active');
        });
    }
}

// Enhanced availability checking (placeholder for real integration)
function checkRealTimeAvailability(date, time, duration) {
    // This would integrate with your actual booking system
    // For now, we simulate availability checking
    
    const dayOfWeek = date.getDay();
    const hour = parseInt(time);
    
    // Business rules
    if (dayOfWeek === 0) return false; // Closed Sundays
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && (hour < 9 || hour >= 19)) return false; // Mon-Fri 9-7
    if (dayOfWeek === 6 && (hour < 9 || hour >= 17)) return false; // Sat 9-5
    
    // Simulate some booked slots
    const bookedSlots = [
        { date: '2024-01-15', time: 14 }, // Example: Jan 15 at 2 PM
        { date: '2024-01-16', time: 10 }, // Example: Jan 16 at 10 AM
    ];
    
    const dateStr = date.toISOString().split('T')[0];
    return !bookedSlots.some(slot => slot.date === dateStr && slot.time === hour);
}

// Accessibility enhancements
function enhanceAccessibility() {
    // Add keyboard navigation for service options
    document.querySelectorAll('.service-option').forEach(option => {
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA live region for status updates
    const statusRegion = document.createElement('div');
    statusRegion.setAttribute('aria-live', 'polite');
    statusRegion.setAttribute('aria-atomic', 'true');
    statusRegion.className = 'sr-only';
    statusRegion.id = 'booking-status';
    document.body.appendChild(statusRegion);
}

// Initialize accessibility features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(enhanceAccessibility, 1000);
});

// Register Service Worker for performance and offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}