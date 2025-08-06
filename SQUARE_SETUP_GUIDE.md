# Square Appointments Setup Guide for Recovery Kneads

## Overview
This guide will help you set up Square Appointments to enable online booking for your massage therapy business.

## Step 1: Create a Square Account
1. Visit [squareup.com](https://squareup.com)
2. Click "Get Started" and create a free account
3. Complete your business profile with:
   - Business name: Recovery Kneads
   - Business type: Health & Beauty
   - Address: 8965 Tamiami Trail N, Suite #43, Naples, FL
   - Phone: (239) 427-4757

## Step 2: Enable Square Appointments
1. Log into your Square Dashboard
2. Navigate to **Appointments** in the left sidebar
3. Click **Get Started** to enable appointments
4. Choose your business type: **Health & Beauty**

## Step 3: Configure Your Services
Add the following services to your Square Appointments:

### Therapeutic Massage
- **Service Name**: Therapeutic Massage
- **Duration**: 60 minutes
- **Price**: $80
- **Description**: Deep tissue and therapeutic massage to relieve tension, reduce pain, and promote healing.

### Therapeutic Massage (90 min)
- **Service Name**: Therapeutic Massage (Extended)
- **Duration**: 90 minutes
- **Price**: $120
- **Description**: Extended therapeutic massage for comprehensive treatment.

### Relaxation Massage
- **Service Name**: Relaxation Massage
- **Duration**: 60 minutes
- **Price**: $70
- **Description**: Gentle, soothing massage designed to reduce stress and promote overall well-being.

### Relaxation Massage (90 min)
- **Service Name**: Relaxation Massage (Extended)
- **Duration**: 90 minutes
- **Price**: $105
- **Description**: Extended relaxation massage for deeper relaxation.

### Sports Massage
- **Service Name**: Sports Massage
- **Duration**: 60 minutes
- **Price**: $85
- **Description**: Specialized massage for athletes and active individuals to enhance performance and recovery.

### Wellness Consultation
- **Service Name**: Wellness Consultation
- **Duration**: 30 minutes
- **Price**: $40
- **Description**: Personalized wellness plans to help you achieve your health and recovery goals.

## Step 4: Set Your Availability
1. Go to **Settings** > **Business Hours**
2. Set your availability:
   - **Monday - Friday**: 9:00 AM - 7:00 PM
   - **Saturday**: 9:00 AM - 5:00 PM
   - **Sunday**: Closed
3. Set buffer time between appointments: 15 minutes
4. Set advance booking notice: 2 hours

## Step 5: Get Your Location ID
1. In Square Appointments, go to **Settings** > **Online Booking**
2. Look for your **Location ID** (it will be a string of letters and numbers)
3. Copy this ID - you'll need it for the website integration

## Step 6: Update Your Website Code
1. Open `script.js` in your website files
2. Find this line: `script.src = 'https://squareup.com/appointments/buyer/widget/your-location-id.js';`
3. Replace `your-location-id` with your actual Square location ID
4. Save the file

## Step 7: Test Your Booking System
1. Visit your website
2. Go to the "Book Now" section
3. Test the booking widget to ensure it's working properly
4. Make a test appointment to verify the full booking flow

## Step 8: Customize Your Booking Page (Optional)
In your Square Dashboard, you can customize:
- **Booking page colors** to match your brand
- **Welcome message** for clients
- **Cancellation policy**
- **Payment methods** accepted
- **Client intake forms** for health information

## Step 9: Set Up Notifications
1. Go to **Settings** > **Notifications**
2. Enable email and SMS notifications for:
   - New appointment bookings
   - Appointment reminders (24 hours before)
   - Cancellation confirmations

## Step 10: Payment Setup
1. Connect your bank account for payments
2. Set up automatic deposits
3. Configure tax settings for Florida
4. Set up receipt customization

## Troubleshooting

### Widget Not Loading
- Check that your location ID is correct
- Ensure your Square Appointments is properly set up
- Clear your browser cache and try again

### Services Not Showing
- Verify all services are published in Square Appointments
- Check that services are set to "Available for online booking"

### Payment Issues
- Ensure your Square account is fully verified
- Check that payment methods are properly configured

## Support Resources
- [Square Appointments Help Center](https://squareup.com/help/us/en/appointments)
- [Square Developer Documentation](https://developer.squareup.com/docs/appointments-api/overview)
- [Square Support](https://squareup.com/help/us/en/contact)

## Next Steps
Once Square Appointments is set up:
1. Share your booking link with clients
2. Add the booking widget to your social media profiles
3. Consider setting up Square Marketing for automated follow-ups
4. Monitor your booking analytics in the Square Dashboard

---

**Need Help?** If you encounter any issues during setup, contact Square Support or refer to their comprehensive help documentation. 