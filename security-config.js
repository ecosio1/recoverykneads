// Security Configuration for Recovery Kneads Website
// This file contains security policies and headers for production deployment

const securityConfig = {
    // Content Security Policy (CSP)
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Only for critical inline scripts - minimize usage
                "https://web.squarecdn.com",
                "https://js.squareup.com",
                "https://www.googletagmanager.com",
                "https://www.google-analytics.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'", // For dynamic styles - minimize usage  
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "https://images.unsplash.com",
                "https://www.google-analytics.com"
            ],
            connectSrc: [
                "'self'",
                "https://connect.squareup.com",
                "https://pci-connect.squareup.com",
                "https://www.google-analytics.com"
            ],
            frameSrc: [
                "https://web.squarecdn.com",
                "https://js.squareup.com"
            ],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            workerSrc: ["'self'"],
            manifestSrc: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"], // Prevent clickjacking
            upgradeInsecureRequests: []
        }
    },

    // Security Headers
    securityHeaders: {
        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',
        
        // Prevent XSS attacks
        'X-XSS-Protection': '1; mode=block',
        
        // Prevent clickjacking
        'X-Frame-Options': 'DENY',
        
        // HTTPS enforcement
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        
        // Referrer policy
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        
        // Feature policy
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',
        
        // Cache control for sensitive pages
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },

    // Rate Limiting Configuration
    rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        skipSuccessfulRequests: true,
        skipFailedRequests: false
    },

    // CORS Configuration
    corsConfig: {
        origin: [
            'https://recoverykneads.com',
            'https://www.recoverykneads.com'
        ],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400 // 24 hours
    },

    // Input Validation Rules
    validation: {
        name: {
            maxLength: 100,
            minLength: 2,
            pattern: /^[a-zA-Z\s'-]+$/,
            required: true
        },
        email: {
            maxLength: 254,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            required: true
        },
        phone: {
            pattern: /^\+?[\d\s\-\(\)]{10,15}$/,
            required: true
        },
        service: {
            allowedValues: [
                'therapeutic-60',
                'therapeutic-90', 
                'deep-tissue-60',
                'deep-tissue-90',
                'sports-60'
            ],
            required: true
        },
        notes: {
            maxLength: 1000,
            required: false
        }
    },

    // Session Configuration
    session: {
        name: 'recoverykneads_session',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // HTTPS only
            httpOnly: true, // Prevent XSS
            maxAge: 30 * 60 * 1000, // 30 minutes
            sameSite: 'strict' // CSRF protection
        }
    },

    // Logging Configuration  
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: 'combined',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d'
    },

    // Production Security Checklist
    productionChecklist: {
        // Environment variables that must be set
        requiredEnvVars: [
            'NODE_ENV',
            'SQUARE_APPLICATION_ID',
            'SQUARE_LOCATION_ID', 
            'SQUARE_ACCESS_TOKEN',
            'SESSION_SECRET',
            'NOTIFICATION_EMAIL'
        ],
        
        // Security validations
        validations: [
            'HTTPS_ENFORCED',
            'CSP_IMPLEMENTED',
            'RATE_LIMITING_ACTIVE',
            'INPUT_VALIDATION_ACTIVE',
            'DEBUG_DISABLED',
            'CORS_CONFIGURED',
            'HEADERS_SECURE'
        ]
    }
};

// CSP Header Generator
function generateCSPHeader(config) {
    const directives = [];
    
    for (const [directive, values] of Object.entries(config.directives)) {
        const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        const valueString = values.join(' ');
        directives.push(`${directiveName} ${valueString}`);
    }
    
    return directives.join('; ');
}

// Security Middleware Factory
function createSecurityMiddleware(app) {
    // Apply security headers
    app.use((req, res, next) => {
        // Set security headers
        for (const [header, value] of Object.entries(securityConfig.securityHeaders)) {
            res.setHeader(header, value);
        }
        
        // Set CSP header
        const cspHeader = generateCSPHeader(securityConfig.contentSecurityPolicy);
        res.setHeader('Content-Security-Policy', cspHeader);
        
        next();
    });
    
    return app;
}

// Input Sanitization
function sanitizeInput(input, fieldType) {
    if (typeof input !== 'string') return input;
    
    const rules = securityConfig.validation[fieldType];
    if (!rules) return input.trim();
    
    // Trim and limit length
    let sanitized = input.trim();
    if (rules.maxLength) {
        sanitized = sanitized.substring(0, rules.maxLength);
    }
    
    // Validate pattern
    if (rules.pattern && !rules.pattern.test(sanitized)) {
        throw new Error(`Invalid ${fieldType} format`);
    }
    
    // Check allowed values
    if (rules.allowedValues && !rules.allowedValues.includes(sanitized)) {
        throw new Error(`Invalid ${fieldType} value`);
    }
    
    // HTML entity encoding
    sanitized = sanitized.replace(/[<>\"'&]/g, function(match) {
        const entityMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        };
        return entityMap[match];
    });
    
    return sanitized;
}

// Environment Validation
function validateEnvironment() {
    const missing = [];
    
    for (const envVar of securityConfig.productionChecklist.requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    // Validate NODE_ENV is production
    if (process.env.NODE_ENV !== 'production') {
        console.warn('Warning: Not running in production mode');
    }
    
    return true;
}

module.exports = {
    securityConfig,
    generateCSPHeader,
    createSecurityMiddleware,
    sanitizeInput,
    validateEnvironment
};