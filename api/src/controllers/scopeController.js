const AvailableCraneDatesDataQuery = require('../data/AvailableCraneDatesDataQuery');

const getAvailableDates = async (req, res) => {
    try {
        const query = new AvailableCraneDatesDataQuery();
        const dates = await query.execute();
        res.json({ dates });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAvailableDates
};