/**
 * Init DB script - creates welfare.db and default admin.
 * Run: npm run init-db
 */
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const dbFile = require('path').join(__dirname, 'data', 'welfare.db');

if (fs.existsSync(dbFile)) {
  console.log('DB already exists at', dbFile);
  process.exit(0);
}

const db = new sqlite3.Database(dbFile);

function run(sql) {
  return new Promise((res, rej) => {
    db.run(sql, (err) => err ? rej(err) : res());
  });
}

async function setup() {
  try {
    await run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      role TEXT,
      force_password_change INTEGER DEFAULT 1,
      secret_key TEXT,
      created_at INTEGER
    );`);

    await run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      gender TEXT,
      full_name TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      hometown TEXT,
      dob TEXT,
      place_of_birth TEXT,
      permanent_address TEXT,
      staff_id TEXT,
      department TEXT,
      pay_mode TEXT,
      id_type TEXT,
      id_number TEXT,
      spouse_name TEXT,
      marital_status TEXT,
      nok_name TEXT,
      nok_relationship TEXT,
      nok_contact TEXT,
      father_name TEXT,
      mother_name TEXT,
      consent INTEGER DEFAULT 1,
      passport_photo_path TEXT,
      selfie_photo_path TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );`);

    await run(`CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER,
      name TEXT,
      dob TEXT
    );`);

    await run(`CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER,
      amount REAL,
      date INTEGER,
      method TEXT,
      status TEXT,
      notes TEXT,
      recorded_by INTEGER,
      created_at INTEGER
    );`);

    await run(`CREATE TABLE IF NOT EXISTS finance_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      amount REAL,
      date INTEGER,
      description TEXT,
      authorized_by INTEGER,
      member_id INTEGER,
      created_at INTEGER
    );`);

    await run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER,
      action TEXT,
      details TEXT,
      timestamp INTEGER
    );`);

    // create default admin
    const defaultEmail = 'smawelfare@admin';
    const defaultPass = 'changeme';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPass, salt);
    await run(`INSERT OR IGNORE INTO admins (email, password_hash, name, role, force_password_change, created_at)
      VALUES ('${defaultEmail}', '${hash}', 'SMA Admin', 'admin', 1, ${Date.now()});`);

    console.log('Database created and default admin inserted.');
  } catch (err) {
    console.error('Failed to initialize DB:', err);
  } finally {
    db.close();
  }
}

setup();
