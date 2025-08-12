// Secure Server-Side Proxy for Square Appointments API
// This file should be deployed to a secure server environment (Node.js/Express)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://web.squarecdn.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
            connectSrc: ["'self'", "https://connect.squareup.com"],
            frameSrc: ["https://web.squarecdn.com"]
        }
    }
}));

// Rate limiting configuration for security
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// CORS configuration for production
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://recoverykneads.com'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Input validation and sanitization
const validateBookingRequest = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Invalid name format'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .isLength({ max: 254 })
        .withMessage('Invalid email address'),
    body('phone')
        .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
        .withMessage('Invalid phone number format'),
    body('service')
        .isIn(['therapeutic-60', 'therapeutic-90', 'deep-tissue-60', 'deep-tissue-90', 'sports-60'])
        .withMessage('Invalid service selection'),
    body('date')
        .isISO8601()
        .toDate()
        .withMessage('Invalid date format'),
    body('time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Invalid time format'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .escape()
        .withMessage('Notes too long')
];

// Secure Square API configuration
const squareConfig = {
    applicationId: process.env.SQUARE_APPLICATION_ID,
    locationId: process.env.SQUARE_LOCATION_ID,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox'
};

// Validate Square configuration on startup
if (!squareConfig.applicationId || !squareConfig.locationId || !squareConfig.accessToken) {
    console.error('FATAL: Missing required Square API configuration');
    process.exit(1);
}

// Secure appointment booking endpoint
app.post('/api/book-appointment', validateBookingRequest, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, phone, service, date, time, notes } = req.body;

        // Additional business logic validation
        const appointmentDate = new Date(date);
        const now = new Date();
        
        if (appointmentDate <= now) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date must be in the future'
            });
        }

        // Check if appointment is during business hours
        const dayOfWeek = appointmentDate.getDay();
        const hour = parseInt(time.split(':')[0]);
        
        if (dayOfWeek === 0) { // Sunday - closed
            return res.status(400).json({
                success: false,
                message: 'We are closed on Sundays'
            });
        }
        
        if ((dayOfWeek >= 1 && dayOfWeek <= 5 && (hour < 9 || hour >= 19)) ||
            (dayOfWeek === 6 && (hour < 9 || hour >= 17))) {
            return res.status(400).json({
                success: false,
                message: 'Selected time is outside business hours'
            });
        }

        // Here you would integrate with Square Appointments API
        // This is a secure server-side call, not exposed to the client
        const appointmentData = {
            name: name,
            email: email,
            phone: phone,
            service: service,
            date: date,
            time: time,
            notes: notes || '',
            created_at: new Date().toISOString(),
            status: 'pending'
        };

        // Log appointment securely (no sensitive data in logs)
        console.log(`New appointment request for ${service} on ${date} at ${time}`);

        // In production, integrate with Square Appointments API here
        // const squareResponse = await createSquareAppointment(appointmentData);

        // For now, we'll simulate success and send notification email
        await sendAppointmentNotification(appointmentData);

        res.status(201).json({
            success: true,
            message: 'Appointment request submitted successfully',
            appointmentId: generateSecureId(),
            estimatedConfirmation: '24 hours'
        });

    } catch (error) {
        console.error('Booking error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error processing appointment request'
        });
    }
});

// Secure appointment availability check
app.get('/api/availability', async (req, res) => {
    try {
        const { date, service } = req.query;

        if (!date || !service) {
            return res.status(400).json({
                success: false,
                message: 'Date and service are required'
            });
        }

        // Validate date format
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        // In production, check actual availability with Square
        const availability = await getAvailableTimeSlots(appointmentDate, service);

        res.json({
            success: true,
            date: date,
            service: service,
            availability: availability
        });

    } catch (error) {
        console.error('Availability check error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error checking availability'
        });
    }
});

// Secure utility functions
function generateSecureId() {
    return require('crypto').randomBytes(16).toString('hex');
}

async function sendAppointmentNotification(appointmentData) {
    // Implement secure email notification
    // Use a service like SendGrid, AWS SES, etc.
    console.log('Sending appointment notification email...');
    
    // Email content should not contain sensitive information
    const emailContent = {
        to: process.env.NOTIFICATION_EMAIL,
        subject: 'New Appointment Request',
        text: `New appointment request for ${appointmentData.service} on ${appointmentData.date} at ${appointmentData.time}`
    };
    
    // Send email using your preferred service
    // await sendEmail(emailContent);
}

async function getAvailableTimeSlots(date, service) {
    // Implement actual availability checking with Square API
    // This is a placeholder that returns mock data
    
    const dayOfWeek = date.getDay();
    const businessHours = getBusinessHours(dayOfWeek);
    
    if (!businessHours) {
        return [];
    }
    
    // Generate available slots based on service duration
    const serviceDuration = getServiceDuration(service);
    const slots = [];
    
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        // In production, check against actual bookings
        const isAvailable = Math.random() > 0.3; // Mock availability
        
        if (isAvailable) {
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                available: true
            });
        }
    }
    
    return slots;
}

function getBusinessHours(dayOfWeek) {
    const hours = {
        0: null, // Sunday - closed
        1: { start: 9, end: 19 }, // Monday
        2: { start: 9, end: 19 }, // Tuesday
        3: { start: 9, end: 19 }, // Wednesday
        4: { start: 9, end: 19 }, // Thursday
        5: { start: 9, end: 19 }, // Friday
        6: { start: 9, end: 17 }  // Saturday
    };
    
    return hours[dayOfWeek];
}

function getServiceDuration(service) {
    const durations = {
        'therapeutic-60': 60,
        'therapeutic-90': 90,
        'deep-tissue-60': 60,
        'deep-tissue-90': 90,
        'sports-60': 60
    };
    
    return durations[service] || 60;
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Secure booking proxy running on port ${PORT}`);
});

module.exports = app;