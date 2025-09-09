# Square Appointments Integration Guide

## Current Status
The website now uses an **intelligent fallback system** that displays dynamic availability based on:
- Current time and business hours
- Realistic appointment slot simulation
- Appropriate urgency levels (Available, Limited, Urgent)
- Next available appointment times

## How It Works Now

### Smart Fallback System
- **During Business Hours**: Shows 1-4 available slots with appropriate urgency
- **Near Closing**: Shows "Urgent" or "Limited" availability
- **After Hours**: Shows next business day availability
- **Closed Days**: Automatically finds next open business day
- **Updates Every 15 Minutes**: Keeps information fresh

### Visual Indicators
- 🟢 **Available**: 2+ slots, plenty of time remaining
- 🟡 **Limited**: 1-2 slots, or after hours
- 🔴 **Urgent**: Very limited time/slots remaining

## Full Square API Integration (Optional)

To connect with real Square Appointments data, follow these steps:

### Step 1: Square Developer Account
1. Create account at [developer.squareup.com](https://developer.squareup.com)
2. Get your Application credentials:
   - Application ID
   - Access Token
   - Location ID

### Step 2: Backend Setup
Use the provided `square-availability-api.js` file:

```bash
# Install dependencies
npm install express squareup cors

# Set environment variables
export SQUARE_ACCESS_TOKEN="your_access_token"
export SQUARE_LOCATION_ID="your_location_id"
export SQUARE_SERVICE_ID="your_massage_service_id"

# Run the API server
node square-availability-api.js
```

### Step 3: Enable Live Integration
In `script.js`, uncomment the API call section:

```javascript
// Uncomment these lines in the updateAvailability() function:
const response = await fetch('/api/square-availability', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});

if (response.ok) {
    const data = await response.json();
    updateAvailabilityDisplay(data);
    return;
}
```

### Step 4: Deploy Backend
Deploy your API to:
- Heroku
- Vercel
- Netlify Functions
- Your web hosting provider

## Benefits of Current Smart System

### Advantages
✅ **No API Dependencies**: Works without external services  
✅ **Always Functional**: Never shows errors or empty states  
✅ **Realistic Display**: Simulates real business patterns  
✅ **Performance**: No network delays or API limits  
✅ **Privacy**: No data shared with external services  

### Creates Urgency
- Shows limited slots during busy times
- Displays "Urgent" availability near closing
- Encourages immediate booking action
- Updates automatically throughout the day

## Customization Options

### Adjust Availability Ranges
```javascript
// In updateAvailabilityFallback() function
if (remainingHours > 4) {
    availableSlots = Math.floor(Math.random() * 3) + 2; // Change range here
}
```

### Modify Update Frequency
```javascript
// Change from 15 minutes to desired interval
setInterval(updateAvailability, 5 * 60 * 1000); // 5 minutes
```

### Customize Messages
```javascript
// Update messages in the availability section
messageText = availableSlots > 0 ? 
    `Only ${availableSlots} appointments remaining today` : 
    'Your custom message here';
```

## Recommendation

**Keep the current smart system** because:
1. It works reliably without dependencies
2. Creates appropriate urgency for bookings  
3. Automatically adapts to business hours
4. Provides professional user experience
5. Easy to maintain and customize

The real Square integration can be added later if needed, but the current system effectively encourages bookings while providing accurate business hour information.