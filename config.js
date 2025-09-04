// Recovery Kneads Configuration
// Public configuration only - no sensitive credentials

const CONFIG = {
    // Square Appointments Configuration - Public URLs only
    SQUARE: {
        // Direct booking URL for your Square appointments page
        BOOKING_URL: 'https://book.squareup.com/appointments/7kl091khfcdu9k/location/L6BYJ6PXFF95P/services',
        LOCATION_ID: 'L6BYJ6PXFF95P',
        ENVIRONMENT: 'production'
    },
    
    // Business Information (public - no need to hide)
    BUSINESS: {
        NAME: 'Recovery Kneads',
        EMAIL: 'massagebyerikag@gmail.com',
        PHONE: '(239) 427-4757',
        ADDRESS: '8965 Tamiami Trail N, Suite #43, Naples, FL'
    },
    
    // Appointments Configuration
    APPOINTMENTS: {
        MIN_ADVANCE_HOURS: 24,  // Minimum hours in advance for booking
        MAX_ADVANCE_DAYS: 90,   // Maximum days in advance for booking
        BUSINESS_HOURS: {
            START: '09:00',
            END: '18:00',
            DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
    }
};

// Prevent modification in production
Object.freeze(CONFIG);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 