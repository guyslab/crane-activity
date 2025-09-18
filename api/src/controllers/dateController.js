const getAvailableDates = (req, res) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    
    res.json({ dates });
};

module.exports = {
    getAvailableDates
};