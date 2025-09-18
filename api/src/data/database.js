const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../crane_activity.db');
  }

  async connect() {
    if (this.db) return this.db;
    
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          this.db = null;
          reject(err);
        } else {
          resolve(this.db);
        }
      });
    });
  }

  async getConnection() {
    try {
      return await this.connect();
    } catch (error) {
      this.db = null;
      throw error;
    }
  }

  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close(() => {
          this.db = null;
          resolve();
        });
      });
    }
  }
}

module.exports = new Database();