const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', 'data', 'welfare.db');
const db = new sqlite3.Database(dbPath);
module.exports = db;
