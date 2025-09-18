const database = require('./database');

class AvailableCraneDatesDataQuery {
  async execute() {
    const db = await database.getConnection();
    
    const sql = `
      SELECT DISTINCT date 
      FROM crane_activity 
      ORDER BY date DESC
    `;
    
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.convertToISODate(row.date)));
      });
    });
  }
  
  convertToISODate(ddmmyyyy) {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = ddmmyyyy.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return ddmmyyyy;
  }
}

module.exports = AvailableCraneDatesDataQuery;