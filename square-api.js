// Square API Integration
// This file handles all Square API communications securely

class SquareAPI {
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl;
        this.accessToken = config.accessToken;
        this.locationId = config.locationId;
        this.applicationId = config.applicationId;
    }

    // Generic API request handler
    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const headers = {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                'Square-Version': '2023-12-13' // Latest API version
            };

            const requestOptions = {
                method: method,
                headers: headers,
                mode: 'cors'
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                requestOptions.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, requestOptions);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Square API Error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Square API Request Failed:', error);
            throw error;
        }
    }

    // Get all services for the location
    async getServices() {
        try {
            const response = await this.makeRequest(`/v2/catalog/list?types=ITEM`);
            
            // Filter for appointment services
            const services = response.objects ? response.objects.filter(obj => 
                obj.type === 'ITEM' && 
                obj.item_data && 
                obj.item_data.product_type === 'APPOINTMENTS_SERVICE'
            ) : [];

            return services.map(service => ({
                id: service.id,
                name: service.item_data.name,
                description: service.item_data.description || '',
                duration: this.parseDuration(service.item_data.item_options),
                price: this.parsePrice(service.item_data.variations)
            }));
        } catch (error) {
            console.error('Failed to fetch services:', error);
            return [];
        }
    }

    // Get available time slots for a date
    async getAvailability(date, serviceId = null) {
        try {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            const searchQuery = {
                query: {
                    filter: {
                        location_filter: {
                            location_ids: [this.locationId]
                        },
                        start_at_filter: {
                            start_at: startDate.toISOString(),
                            end_at: endDate.toISOString()
                        }
                    }
                }
            };

            const response = await this.makeRequest('/v2/bookings/availability/search', 'POST', searchQuery);
            return response.availabilities || [];
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            return [];
        }
    }

    // Create a new booking
    async createBooking(bookingData) {
        try {
            const { service, date, time, customer } = bookingData;
            
            // Convert date and time to ISO string
            const appointmentTime = new Date(`${date.toDateString()} ${time}`);
            
            // Calculate end time (assume 45 minutes for now)
            const endTime = new Date(appointmentTime.getTime() + (45 * 60 * 1000));

            const booking = {
                booking: {
                    location_id: this.locationId,
                    start_at: appointmentTime.toISOString(),
                    duration_minutes: 45,
                    appointment_segments: [{
                        duration_minutes: 45,
                        service_variation_id: service.service || 'default',
                        service_variation_version: 1
                    }],
                    customer_details: {
                        given_name: customer.firstName,
                        family_name: customer.lastName,
                        email_address: customer.email,
                        phone_number: customer.phone,
                        note: customer.notes || ''
                    },
                    seller_note: `Booking made through Recovery Kneads website. Service: ${service.name}`,
                    source: 'FIRST_PARTY_MERCHANT'
                },
                idempotency_key: this.generateIdempotencyKey()
            };

            const response = await this.makeRequest('/v2/bookings', 'POST', booking);
            return response.booking;
        } catch (error) {
            console.error('Failed to create booking:', error);
            throw error;
        }
    }

    // Update/cancel a booking
    async updateBooking(bookingId, updateData) {
        try {
            const response = await this.makeRequest(`/v2/bookings/${bookingId}`, 'PUT', {
                booking: updateData,
                idempotency_key: this.generateIdempotencyKey()
            });
            return response.booking;
        } catch (error) {
            console.error('Failed to update booking:', error);
            throw error;
        }
    }

    // Get booking details
    async getBooking(bookingId) {
        try {
            const response = await this.makeRequest(`/v2/bookings/${bookingId}`);
            return response.booking;
        } catch (error) {
            console.error('Failed to get booking:', error);
            throw error;
        }
    }

    // Helper methods
    parseDuration(itemOptions) {
        // Extract duration from item options or default to 45 minutes
        return 45; // Default duration
    }

    parsePrice(variations) {
        if (!variations || variations.length === 0) return 9000; // $90.00 in cents
        
        const firstVariation = variations[0];
        return firstVariation.item_variation_data?.price_money?.amount || 9000;
    }

    generateIdempotencyKey() {
        return 'rk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Format booking data for display
    formatBookingForDisplay(booking) {
        return {
            id: booking.id,
            confirmationNumber: booking.id.slice(-8).toUpperCase(),
            service: booking.appointment_segments[0]?.service_variation_id || 'Service',
            startTime: new Date(booking.start_at),
            duration: booking.duration_minutes || 45,
            customer: {
                name: `${booking.customer_details.given_name} ${booking.customer_details.family_name}`,
                email: booking.customer_details.email_address,
                phone: booking.customer_details.phone_number
            },
            status: booking.status,
            notes: booking.customer_note || booking.seller_note || ''
        };
    }
}

// Initialize Square API when configuration is loaded
let squareAPI = null;

function initializeSquareAPI() {
    if (typeof SQUARE_CONFIG !== 'undefined') {
        squareAPI = new SquareAPI(SQUARE_CONFIG);
        console.log('Square API initialized successfully');
        return squareAPI;
    } else {
        console.error('Square configuration not loaded');
        return null;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SquareAPI, initializeSquareAPI };
} else {
    window.SquareAPI = SquareAPI;
    window.initializeSquareAPI = initializeSquareAPI;
}