// server.js — Express + SQLite backend for SMA Welfare System
// Place this file in the project root (same folder as package.json)

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve renderer files if requested via HTTP (optional, Electron loads files directly)
app.use(express.static(path.join(__dirname, 'renderer')));

// Ensure data folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Database path - consistent with init_db.js created file
const dbPath = path.join(__dirname, 'data', 'welfare.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Failed to open SQLite database at', dbPath, err.message);
    } else {
        console.log('✅ Connected to SQLite database at', dbPath);
    }
});

// Safe helper to run a statement returning Promise
function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Safe helper to get a single row
function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// --- Basic health route ---
app.get('/api/test', (req, res) => {
    res.json({ ok: true, msg: 'Backend running' });
});

// --- LOGIN ---
// Accepts { email, password }
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.json({ success: false, message: 'Email and password required' });

        const row = await getAsync('SELECT * FROM admins WHERE email = ?', [email]);

        if (!row) {
            return res.json({ success: false, message: 'No such user' });
        }

        // row.password_hash expected (init_db.js used bcrypt)
        const hash = row.password_hash || row.password; // backwards compatibility
        const ok = hash ? bcrypt.compareSync(password, hash) : (password === row.password);

        if (!ok) return res.json({ success: false, message: 'Invalid password' });

        // successful login
        return res.json({
            success: true,
            adminId: row.id,
            force_password_change: !!row.force_password_change,
            name: row.name || null
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// --- CHANGE PASSWORD ---
// Accepts { adminId, newPassword }
app.post('/change-password', async (req, res) => {
    try {
        const { adminId, newPassword } = req.body;
        if (!adminId || !newPassword) return res.status(400).json({ success: false, message: 'adminId and newPassword required' });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        await runAsync('UPDATE admins SET password_hash = ?, force_password_change = 0 WHERE id = ?', [hash, adminId]);

        // log audit if table exists
        try {
            await runAsync('INSERT INTO audit_logs (admin_id, action, details, timestamp) VALUES (?,?,?,?)', [adminId, 'password_change', 'Changed password', Date.now()]);
        } catch (e) {
            // ignore if audit table missing
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('Change password error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// (Optional) endpoint to check admin by id
app.get('/admin/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });
        const row = await getAsync('SELECT id, email, name, role FROM admins WHERE id = ?', [id]);
        if (!row) return res.status(404).json({ success: false, message: 'Not found' });
        return res.json({ success: true, admin: row });
    } catch (err) {
        console.error('Admin lookup error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
