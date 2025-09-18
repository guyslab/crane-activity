const fs = require('fs');
const path = require('path');
const database = require('../src/data/database');

const CSV_PATH = path.join(__dirname, '../../seed/sample_data.csv');

async function createTable(db) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS crane_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_time TEXT,
      utc_time DATETIME NOT NULL,
      date DATE NOT NULL,
      time TEXT,
      position_x REAL,
      position_y REAL,
      position_z REAL,
      slew REAL,
      jib REAL,
      hoist REAL,
      weight REAL,
      wind REAL,
      cable_weight REAL,
      seconds INTEGER,
      controller_is_moving INTEGER,
      controller_direction INTEGER,
      controller_g2 INTEGER,
      controller_g3 INTEGER,
      is_prev INTEGER,
      weight_rounded REAL,
      weight_fixed REAL,
      weight_smooth REAL,
      weight_by_controller_direction REAL,
      is_moving INTEGER NOT NULL,
      is_loaded INTEGER NOT NULL,
      state TEXT,
      state_grouping REAL,
      grouping_lifting_events REAL,
      grouping_moving_events REAL
    )
  `;
  
  return new Promise((resolve, reject) => {
    db.run(createTableSQL, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function createIndexes(db) {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_date ON crane_activity(date)',
    'CREATE INDEX IF NOT EXISTS idx_date_status ON crane_activity(date, is_moving, is_loaded)'
  ];
  
  for (const indexSQL of indexes) {
    await new Promise((resolve, reject) => {
      db.run(indexSQL, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

async function checkIfDataExists(db) {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM crane_activity', (err, row) => {
      if (err) reject(err);
      else resolve(row.count > 0);
    });
  });
}

async function insertData(db, csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  const insertSQL = `
    INSERT INTO crane_activity (
      date_time, utc_time, date, time, position_x, position_y, position_z,
      slew, jib, hoist, weight, wind, cable_weight, seconds,
      controller_is_moving, controller_direction, controller_g2, controller_g3,
      is_prev, weight_rounded, weight_fixed, weight_smooth,
      weight_by_controller_direction, is_moving, is_loaded, state,
      state_grouping, grouping_lifting_events, grouping_moving_events
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const stmt = db.prepare(insertSQL);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length >= 29) {
      await new Promise((resolve, reject) => {
        stmt.run(values, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
  
  stmt.finalize();
}

async function seed() {
  try {
    console.log('Starting database seed...');
    
    const db = await database.getConnection();
    console.log('Database connected');
    
    await createTable(db);
    console.log('Table created/verified');
    
    await createIndexes(db);
    console.log('Indexes created');
    
    const dataExists = await checkIfDataExists(db);
    if (dataExists) {
      console.log('Data already exists, skipping seed');
      return;
    }
    
    const csvData = fs.readFileSync(CSV_PATH, 'utf8');
    await insertData(db, csvData);
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };