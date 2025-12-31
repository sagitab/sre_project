const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3001;
const mysql = require('mysql2/promise');
const pool = require('./db/db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });


});

const log4js = require('log4js');

// Configure log4js
log4js.configure({
  appenders: { 
    out: { 
      type: 'stdout', 
      layout: { type: 'messagePassThrough' } // This allows us to send raw JSON strings
    } 
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
});

const logger = log4js.getLogger('user-activity');

// Helper function to log user activity
const logUserActivity = (userId, action, ip) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId: userId,
        action: action,
        ipAddress: ip || 'unknown'
    };
    
    // Log as a JSON string to the console
    logger.info(JSON.stringify(logEntry));
};

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const userIp = req.ip || req.connection.remoteAddress;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Query TiDB for the user [cite: 14, 15]
        const [rows] = await pool.execute(
            'SELECT id, username FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }



        const user = rows[0];
        const mockToken = `token_${Math.random().toString(36).substr(2)}`;

        // Requirement: User tokens stored in database [cite: 20]
        await pool.execute(
            'INSERT INTO user_tokens (user_id, token) VALUES (?, ?)',
            [user.id, mockToken]
        );

            // Log the successful login
        logUserActivity(user.id, 'LOGIN_SUCCESS', userIp);
        res.json({ 
        success: true, 
        token: mockToken, 
        message: 'Logged in and token stored!' 
        });

    } catch (err) {
        console.error(err);
        logUserActivity(null, 'LOGIN_FAILED', userIp);
        res.status(500).json({ error: 'Database connection error' });
    }

});

app.get('/api/user', async (req, res) => {
    // 1. Get the raw header (e.g., "Bearer token_xyz")
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // 2. FIX: Extract ONLY the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1]; 

    try {
        // 3. FIX: Join users with user_tokens table to find the username
        const [rows] = await pool.execute(`
            SELECT u.username 
            FROM users u
            JOIN user_tokens t ON u.id = t.user_id
            WHERE t.token = ?`, 
            [token]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Unauthorized: Invalid token' });
        }

        // 4. Return the message (data.message) that the frontend expects
        res.json({ message: `Hello, ${rows[0].username}! You are authenticated.` });

    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the actual token string
    const userIp = req.ip || req.connection.remoteAddress;

    if (!token) return res.json({ message: 'No token provided, logged out locally' });

    try {

        const [rows] = await pool.execute(`
            SELECT u.username 
            FROM users u
            JOIN user_tokens t ON u.id = t.user_id
            WHERE t.token = ?`, 
            [token]
        );
        const user = rows[0];

        // Use 'pool' (your db connection) and target the correct table 'user_tokens'
        await pool.execute('DELETE FROM user_tokens WHERE token = ?', [token]);
        
        // SRE Requirement: Log the logout event
        logUserActivity(user.id, 'LOGOUT_SUCCESS', userIp);

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Add this to server.js
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
