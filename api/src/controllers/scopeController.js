const getAvailableDates = (req, res) => {
    const dates = [];
    
    // Generate dates from March 2024 to December 2024
    for (let month = 2; month <= 11; month++) { // 2 = March, 11 = December
        const daysInMonth = new Date(2024, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            // Skip weekends
            const date = new Date(2024, month, day);
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                dates.push(date.toISOString().split('T')[0]);
            }
        }
    }
    
    res.json({ dates });
};

module.exports = {
    getAvailableDates
};