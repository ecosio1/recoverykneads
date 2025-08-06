// Recovery Kneads Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
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
    
    // Navbar background opacity on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Animation on scroll (simple fade in)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-text, .contact-item').forEach(el => {
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

// Embedded booking form for direct website booking
function showDirectBookingOption() {
    const widgetContainer = document.getElementById('square-appointments-widget');
    if (widgetContainer) {
        widgetContainer.innerHTML = `
            <div class="booking-form-container">
                <h3>Book Your Appointment</h3>
                <form id="appointmentForm" class="appointment-form">
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="service">Service Type *</label>
                        <select id="service" name="service" required>
                            <option value="">Select a service</option>
                            <option value="therapeutic-60">Therapeutic Massage (60 min) - $80</option>
                            <option value="therapeutic-90">Therapeutic Massage (90 min) - $120</option>
                            <option value="sports-60">Sports Massage (60 min) - $85</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="date">Preferred Date *</label>
                            <input type="date" id="date" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="time">Preferred Time *</label>
                            <select id="time" name="time" required>
                                <option value="">Select time</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                                <option value="17:00">5:00 PM</option>
                                <option value="18:00">6:00 PM</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="notes">Special Requests or Notes</label>
                        <textarea id="notes" name="notes" rows="3" placeholder="Any specific areas of concern, allergies, or special requests..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn-primary">Request Appointment</button>
                </form>
            </div>
        `;
        
        // Initialize the booking form
        initBookingForm();
    }
}

// Initialize the booking form functionality
function initBookingForm() {
    // Set minimum date for appointment booking (today)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const appointmentData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time'),
                notes: formData.get('notes')
            };
            
            // Basic form validation
            if (!appointmentData.name || !appointmentData.email || !appointmentData.phone || 
                !appointmentData.service || !appointmentData.date || !appointmentData.time) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(appointmentData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(appointmentData.phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // Date validation (not in the past)
            const selectedDate = new Date(appointmentData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                alert('Please select a future date for your appointment.');
                return;
            }
            
            // Submit the appointment
            submitAppointment(appointmentData);
        });
    }
    
    // Apply phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    }
}