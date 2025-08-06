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
            
            // Simulate form submission (in a real implementation, this would send to a server)
            submitAppointment(appointmentData);
        });
    }
    
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

// Function to simulate appointment submission
function submitAppointment(appointmentData) {
    // Show loading state
    const submitButton = document.querySelector('#appointmentForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        document.getElementById('appointmentForm').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // In a real implementation, you would:
        // 1. Send the data to your backend server
        // 2. Integrate with a calendar system
        // 3. Send confirmation emails
        // 4. Handle payment processing if needed
        
        console.log('Appointment request submitted:', appointmentData);
        
        // You could also integrate with services like:
        // - Calendly API
        // - Google Calendar API
        // - Square Appointments
        // - Acuity Scheduling
        // - Or build a custom booking system
        
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
        <strong>Thank you!</strong> Your appointment request has been submitted. 
        We'll contact you within 24 hours to confirm your appointment.
    `;
    
    // Insert before the form
    const form = document.querySelector('.booking-form');
    form.insertBefore(successDiv, form.firstChild);
    
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