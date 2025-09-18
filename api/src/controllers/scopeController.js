class ScopeController {
    constructor(getAvailableDatesQuery) {
        this.getAvailableDatesQuery = getAvailableDatesQuery;
    }

    async getAvailableDates(req, res) {
        try {
            const result = await this.getAvailableDatesQuery.execute();
            res.json(result);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = ScopeController;