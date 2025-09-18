const getDailyReport = (req, res) => {
    const { date } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    // Simulate no data for some dates
    const dateObj = new Date(date);
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
        return res.status(404).json({ error: 'No data available for this date' });
    }
    
    // Mock data
    const mockReport = {
        date: date,
        total_records: Math.floor(Math.random() * 2000) + 1000,
        daily_stats: {
            start_time: "7:03",
            end_time: "16:47",
            working_hours: "9:44",
            utilized_hours: "7:25",
            utilization_percent: Math.floor(Math.random() * 40) + 60
        },
        breakdown: {
            moving_with_load: {
                duration: "00:48",
                records: 123,
                avg_weight: 2.3
            },
            moving_without_load: {
                duration: "05:33",
                records: 875,
                avg_weight: 0.0
            },
            idle_with_load: {
                duration: "00:59",
                records: 89,
                avg_weight: 1.8
            },
            idle_without_load: {
                duration: "02:18",
                records: 160,
                avg_weight: 0.0
            }
        }
    };
    
    res.json(mockReport);
};

module.exports = {
    getDailyReport
};