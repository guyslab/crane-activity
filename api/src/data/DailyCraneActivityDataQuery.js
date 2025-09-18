const database = require('./database');

class DailyCraneActivityDataQuery {
  async execute(date) {
    const db = await database.getConnection();
    
    // Convert YYYY-MM-DD to DD/MM/YYYY if needed
    const dbDate = this.convertToDBDate(date);
    
    // Get aggregated data by status
    const aggregateSQL = `
      SELECT 
        COUNT(*) as records,
        AVG(weight) as avg_weight,
        is_moving,
        is_loaded,
        MIN(utc_time) as min_time,
        MAX(utc_time) as max_time
      FROM crane_activity 
      WHERE date = ?
      GROUP BY is_moving, is_loaded
    `;
    
    // Get duration by calculating time differences between consecutive records
    const durationSQL = `
      WITH status_changes AS (
        SELECT 
          utc_time,
          is_moving,
          is_loaded,
          LAG(utc_time) OVER (ORDER BY utc_time) as prev_time,
          LAG(is_moving) OVER (ORDER BY utc_time) as prev_moving,
          LAG(is_loaded) OVER (ORDER BY utc_time) as prev_loaded
        FROM crane_activity 
        WHERE date = ?
        ORDER BY utc_time
      )
      SELECT 
        is_moving,
        is_loaded,
        SUM(CASE WHEN prev_moving = is_moving AND prev_loaded = is_loaded 
            THEN (julianday(utc_time) - julianday(prev_time)) * 24 * 3600 
            ELSE 0 END) as duration_seconds
      FROM status_changes
      WHERE prev_time IS NOT NULL
      GROUP BY is_moving, is_loaded
    `;
    
    const [aggregateRows, durationRows] = await Promise.all([
      new Promise((resolve, reject) => {
        db.all(aggregateSQL, [dbDate], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.all(durationSQL, [dbDate], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      })
    ]);
    
    if (aggregateRows.length === 0) {
      return null;
    }
    
    // Create duration lookup
    const durationMap = {};
    durationRows.forEach(row => {
      const key = `${row.is_moving}_${row.is_loaded}`;
      durationMap[key] = row.duration_seconds || 0;
    });
    
    // Build report structure
    const breakdown = {};
    let totalRecords = 0;
    let minTime = null;
    let maxTime = null;
    
    aggregateRows.forEach(row => {
      const categoryKey = row.is_moving ? 
        (row.is_loaded ? 'moving_with_load' : 'moving_without_load') :
        (row.is_loaded ? 'idle_with_load' : 'idle_without_load');
      
      const durationKey = `${row.is_moving}_${row.is_loaded}`;
      const durationSeconds = durationMap[durationKey] || 0;
      
      breakdown[categoryKey] = {
        duration: this.formatDuration(durationSeconds),
        records: row.records,
        avg_weight: Math.round((row.avg_weight || 0) * 10) / 10
      };
      
      totalRecords += row.records;
      if (!minTime || row.min_time < minTime) minTime = row.min_time;
      if (!maxTime || row.max_time > maxTime) maxTime = row.max_time;
    });
    
    // Calculate daily stats
    const workingSeconds = minTime && maxTime ? 
      (new Date(maxTime) - new Date(minTime)) / 1000 : 0;
    
    const utilizedSeconds = (durationMap['1_0'] || 0) + (durationMap['1_1'] || 0);
    const utilizationPercent = workingSeconds > 0 ? 
      Math.round((utilizedSeconds / workingSeconds) * 100) : 0;
    
    return {
      date,
      total_records: totalRecords,
      daily_stats: {
        start_time: this.formatTime(minTime),
        end_time: this.formatTime(maxTime),
        working_hours: this.formatDuration(workingSeconds),
        utilized_hours: this.formatDuration(utilizedSeconds),
        utilization_percent: utilizationPercent
      },
      breakdown
    };
  }
  
  formatDuration(seconds) {
    if (!seconds) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  formatTime(utcTime) {
    if (!utcTime) return "00:00";
    const date = new Date(utcTime);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  convertToDBDate(isoDate) {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    if (isoDate.includes('-')) {
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return isoDate;
  }
}

module.exports = DailyCraneActivityDataQuery;