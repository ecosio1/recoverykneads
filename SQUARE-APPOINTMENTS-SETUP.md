# Square Appointments Integration Guide for Recovery Kneads

## 🎯 Overview

This guide provides step-by-step instructions for integrating Square Appointments with your Recovery Kneads booking system. The system includes both Square Appointments integration and a professional fallback booking system.

## 📋 Prerequisites

Before starting, ensure you have:
- A Square Developer Account
- A Square Seller Account with Appointments enabled
- Basic understanding of HTML/JavaScript
- Access to your website files

## 🚀 Quick Start

### Step 1: Square Developer Setup

1. **Create Square Developer Account**
   - Visit [developer.squareup.com](https://developer.squareup.com)
   - Sign up or log in with your Square account
   - Create a new application

2. **Get Your Credentials**
   ```
   Application ID: sq0idp-[your-app-id]
   Location ID: [your-location-id]
   Environment: sandbox (for testing) or production
   ```

### Step 2: Enable Square Appointments

1. Log into your Square Dashboard
2. Navigate to **Apps & Integrations**
3. Find and enable **Square Appointments**
4. Set up your services:
   - Therapeutic Massage (60 min) - $80
   - Therapeutic Massage (90 min) - $120
   - Deep Tissue Massage (60 min) - $85
   - Deep Tissue Massage (90 min) - $125
   - Sports Massage (60 min) - $85

### Step 3: Configure Business Hours

Set your availability in Square Appointments:
- **Monday - Friday:** 9:00 AM - 7:00 PM
- **Saturday:** 9:00 AM - 5:00 PM  
- **Sunday:** Closed

## 🔧 Technical Integration

### Method 1: Square Appointments Widget (Recommended)

1. **Add Square Script to HTML**
   ```html
   <!-- Add this to your <head> section -->
   <script src="https://js.squareup.com/v2/appointments"></script>
   ```

2. **Update Your Application IDs**
   In `script.js`, find the `initializeSquareAppointments` function and replace:
   ```javascript
   applicationId: 'YOUR_APPLICATION_ID', // Replace with your actual Application ID
   locationId: 'YOUR_LOCATION_ID', // Replace with your actual Location ID
   environment: 'sandbox', // Change to 'production' when ready
   ```

3. **Test Integration**
   - Start with `environment: 'sandbox'`
   - Test all booking flows
   - Verify appointments appear in your Square Dashboard
   - Switch to `environment: 'production'` when ready

### Method 2: Custom Integration (Advanced)

If you need more customization, you can use Square's APIs directly:

```javascript
// Initialize Square Payments SDK
const payments = Square.payments(applicationId, locationId);

// Create booking via API
async function createAppointment(appointmentData) {
    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            location_id: locationId,
            start_at: appointmentData.startTime,
            service_id: appointmentData.serviceId,
            customer_note: appointmentData.notes
        })
    });
    
    return response.json();
}
```

## 🎨 Styling Customization

The current system automatically applies Recovery Kneads branding to the Square widget:

```javascript
styles: {
    primaryColor: '#f4a87c',      // Peach
    secondaryColor: '#e8906b',    // Coral  
    fontFamily: 'Open Sans, sans-serif'
}
```

### Custom CSS Overrides

You can further customize the Square widget appearance:

```css
/* Square Appointments Widget Customization */
.sq-appointments-widget {
    border-radius: 1rem !important;
    box-shadow: 0 25px 100px rgba(139, 74, 59, 0.15) !important;
}

.sq-appointments-widget .sq-button-primary {
    background: linear-gradient(135deg, #f4a87c 0%, #e8906b 100%) !important;
    border: none !important;
}

.sq-appointments-widget .sq-calendar-day.selected {
    background: #f4a87c !important;
}
```

## 🛡️ Security & Compliance

### HIPAA Compliance Considerations

1. **Data Handling**
   - All client information is encrypted in transit
   - Square is HIPAA-compliant when properly configured
   - No sensitive health data stored locally

2. **Privacy Policy Updates**
   Update your privacy policy to include:
   ```
   We use Square Appointments to manage bookings. Your appointment 
   data is processed securely and in compliance with healthcare 
   privacy regulations.
   ```

3. **Access Controls**
   - Limit access to appointment data
   - Regular security audits
   - Staff training on data privacy

## 📱 Mobile Optimization

The booking system is fully responsive. Square Appointments automatically adapts to mobile devices.

### Mobile-Specific Features
- Touch-friendly calendar navigation
- Optimized form layouts
- Tap-to-call functionality
- Easy sharing options

## 🔄 Fallback System

The system includes a professional fallback if Square Appointments fails:

### Automatic Fallback Triggers
- Square services unavailable
- Network connectivity issues
- Widget loading failures

### Fallback Features
- Full calendar booking system
- Form validation and submission
- Email notifications
- Professional UI matching your brand

## 📧 Email Configuration

### Automated Email Notifications

The system sends formatted appointment requests:

```
🏥 NEW APPOINTMENT REQUEST

📋 APPOINTMENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Deep Tissue Massage
Duration: 60 minutes
Date: January 15, 2024
Time: 2:00 PM
Price: $85

👤 CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: John Smith
Email: john@example.com
Phone: (239) 555-0123
Client Type: New Client

📝 SPECIAL REQUESTS/NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lower back pain, prefer medium pressure

⚠️ BOOKING PRIORITY: High (Online Booking)
📅 Submitted: 1/10/2024, 3:45:23 PM

Please contact the client within 24 hours to confirm.
```

## 🧪 Testing Checklist

### Before Going Live

- [ ] Square sandbox integration working
- [ ] All services properly configured
- [ ] Business hours set correctly
- [ ] Email notifications received
- [ ] Mobile responsiveness tested
- [ ] Accessibility tested with screen readers
- [ ] Fallback system tested
- [ ] Payment processing tested (if applicable)
- [ ] Calendar synchronization verified
- [ ] Staff notification system working

### Testing Scenarios

1. **Happy Path**: Complete booking flow
2. **Error Handling**: Network failures, invalid data
3. **Mobile Experience**: All screen sizes
4. **Accessibility**: Screen readers, keyboard navigation
5. **Edge Cases**: Fully booked days, past dates

## 🚨 Troubleshooting

### Common Issues

**Issue**: Square widget not loading
```javascript
// Check browser console for errors
// Verify application ID and location ID
// Ensure scripts are loaded correctly
```

**Issue**: Appointments not showing in Square Dashboard
```javascript
// Check environment setting (sandbox vs production)
// Verify location ID matches your business location
// Check Square Appointments is enabled in your account
```

**Issue**: Styling not applied
```css
/* Ensure CSS has higher specificity */
.sq-appointments-widget .sq-button-primary {
    background: #f4a87c !important;
}
```

### Debug Mode

Enable debug logging:
```javascript
// Add to console for debugging
console.log('Square Appointments Debug:', {
    applicationId: 'YOUR_APPLICATION_ID',
    locationId: 'YOUR_LOCATION_ID',
    environment: 'sandbox'
});
```

## 📊 Analytics Integration

Track booking performance:

```javascript
// Google Analytics 4 integration
gtag('event', 'appointment_request', {
    'event_category': 'booking',
    'event_label': appointmentData.service,
    'value': parseInt(appointmentData.price)
});

// Facebook Pixel integration
fbq('track', 'Schedule', {
    content_name: appointmentData.service,
    value: appointmentData.price,
    currency: 'USD'
});
```

## 🔧 Maintenance

### Regular Tasks

1. **Monthly**: Review appointment analytics
2. **Weekly**: Test booking system functionality
3. **Quarterly**: Update service pricing if needed
4. **As needed**: Update business hours for holidays

### Updates

Keep your integration current:
- Monitor Square Developer notifications
- Update SDK versions when available
- Test new features in sandbox first

## 📞 Support

### Square Support
- [Square Developer Documentation](https://developer.squareup.com/docs/appointments)
- [Square Support](https://squareup.com/help)
- [Developer Community](https://developer.squareup.com/forums)

### Recovery Kneads Specific
- Email: massagebyerikag@gmail.com
- Phone: (239) 427-4757

### Emergency Contacts
If the booking system fails:
1. Check fallback system is working
2. Direct clients to phone/email booking
3. Post notice on website if extended downtime

## 🎉 Go-Live Checklist

Final steps before launch:

- [ ] Switch to production environment
- [ ] Update all credentials
- [ ] Test complete booking flow
- [ ] Train staff on new system
- [ ] Update website navigation
- [ ] Announce new booking system to clients
- [ ] Monitor for first 48 hours
- [ ] Gather client feedback

---

**Need Help?** Contact the Recovery Kneads technical team or refer to Square's comprehensive documentation for advanced configurations.

*Last Updated: [Current Date]*
*Version: 1.0*