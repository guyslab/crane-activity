class DateService {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }
    
    async getAvailableDates() {
        try {
            const response = await fetch(`${this.baseUrl}/api/available-dates`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.dates;
        } catch (error) {
            console.error('Error fetching available dates:', error);
            throw error;
        }
    }
}

const dateService = new DateService();