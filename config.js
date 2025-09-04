// Recovery Kneads Configuration
// Loads Square credentials from environment variables

const CONFIG = {
    // Square Appointments Configuration - populated from .env file
    SQUARE: {
        APPLICATION_ID: process.env.SQUARE_APPLICATION_ID || 'sq0idp-PAz033vFLVTZyMqiGdOIiQ',
        LOCATION_ID: process.env.SQUARE_LOCATION_ID || 'L6BYJ6PXFF95P',
        ENVIRONMENT: process.env.SQUARE_ENVIRONMENT || 'production',
        ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN || 'EAAAl5gtRPl8nUjbGGoVpitDqko9zDStrx4UvuN__rZhuzkb9yvBOANiClSBC8pD'
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