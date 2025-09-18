class ReportService {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }
    
    async getDailyReport(date) {
        try {
            const response = await fetch(`${this.baseUrl}/api/daily-report?date=${date}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching daily report:', error);
            throw error;
        }
    }
    
    async getAvailableDates() {
        try {
            const response = await fetch(`${this.baseUrl}/api/available-dates`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching available dates:', error);
            throw error;
        }
    }
}

const reportService = new ReportService();