const DailyCraneActivityDataQuery = require('../data/DailyCraneActivityDataQuery');

const getDailyReport = async (req, res) => {
    const { date } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    try {
        const query = new DailyCraneActivityDataQuery();
        const report = await query.execute(date);
        
        if (!report) {
            return res.status(404).json({ error: 'No data available for this date' });
        }
        
        res.json(report);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getDailyReport
};