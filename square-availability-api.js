// Square Appointments Availability API Integration
// This file shows how to integrate with Square's Bookings API for real-time availability

const express = require('express');
const { Client, Environment } = require('squareup');

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN, // Set in your environment variables
  environment: Environment.Sandbox // Change to Environment.Production for live
});

const app = express();

// CORS middleware for your domain
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://recoverykneads.com');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API endpoint to get availability
app.get('/api/square-availability', async (req, res) => {
  try {
    const bookingsApi = squareClient.bookingsApi;
    
    // Get today's date range
    const today = new Date();
    const startTime = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endTime = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    
    // Search for available time slots
    const searchRequest = {
      query: {
        filter: {
          startAtRange: {
            startAt: startTime,
            endAt: endTime
          },
          locationId: process.env.SQUARE_LOCATION_ID, // Your Square location ID
          serviceVariationId: process.env.SQUARE_SERVICE_ID // Your massage service ID
        }
      }
    };
    
    const response = await bookingsApi.searchAvailability(searchRequest);
    
    if (response.result && response.result.availabilities) {
      const availabilities = response.result.availabilities;
      const availableSlots = availabilities.length;
      
      // Get next available time
      let nextAvailableTime = 'Call for availability';
      if (availableSlots > 0) {
        const nextSlot = new Date(availabilities[0].startAt);
        nextAvailableTime = nextSlot.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      
      res.json({
        success: true,
        availableSlots,
        nextAvailableTime,
        totalSlots: availabilities.length
      });
    } else {
      // Fallback response
      res.json({
        success: false,
        availableSlots: 0,
        nextAvailableTime: 'Call for availability'
      });
    }
    
  } catch (error) {
    console.error('Square API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to fetch availability',
      availableSlots: 0,
      nextAvailableTime: 'Call for availability'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'square-availability' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Square availability API running on port ${port}`);
});

module.exports = app;