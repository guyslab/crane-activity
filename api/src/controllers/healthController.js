const getHealth = (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'crane-activity-api'
    });
};

module.exports = {
    getHealth
};