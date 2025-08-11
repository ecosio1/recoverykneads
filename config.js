// Recovery Kneads Configuration
// Update these values with your actual Square Appointments credentials

const CONFIG = {
    // Square Appointments Configuration
    SQUARE: {
        APPLICATION_ID: 'YOUR_APPLICATION_ID', // Replace with actual Application ID
        LOCATION_ID: 'YOUR_LOCATION_ID',       // Replace with actual Location ID
        ENVIRONMENT: 'sandbox',                // Change to 'production' when ready
        API_KEY: 'YOUR_API_KEY',               // Replace with actual API Key if using direct API
        ACCESS_TOKEN: 'YOUR_ACCESS_TOKEN'      // Replace with actual Access Token if using OAuth
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