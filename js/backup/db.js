// db.js - SQLite database interactions
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'snapchat.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Database connected.');

// Create tables if they don't exist
const initDb = () => {
    // Create users table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // Create snaps table with foreign key
    db.prepare(`
        CREATE TABLE IF NOT EXISTS snaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            image_path TEXT NOT NULL,
            caption TEXT,
            hashtags TEXT,
            location TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            posted_by INTEGER,
            FOREIGN KEY (posted_by) REFERENCES users(id)
        )
    `).run();

    // Create views table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS views (
            snap_id INTEGER,
            viewed_by INTEGER,
            viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (snap_id, viewed_by),
            FOREIGN KEY (snap_id) REFERENCES snaps(id) ON DELETE CASCADE,
            FOREIGN KEY (viewed_by) REFERENCES users(id)
        )
    `).run();

    // Create indexes
    db.prepare('CREATE INDEX IF NOT EXISTS idx_snaps_posted_by ON snaps(posted_by)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_snaps_created_at ON snaps(created_at)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_views_snap_id ON views(snap_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_views_viewed_by ON views(viewed_by)').run();
};

// Initialize database
initDb();

// --- User-related Functions ---
const createUserStmt = db.prepare('INSERT INTO users (username) VALUES (?)');
const findUserStmt = db.prepare('SELECT * FROM users WHERE username = ?');

// --- Snap-related Functions ---
const addSnapStmt = db.prepare(`
    INSERT INTO snaps (username, image_path, caption, hashtags, location, posted_by)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const getAllSnapsStmt = db.prepare(`
    SELECT 
        s.id,
        s.username,
        '/uploads/' || s.image_path as imageUrl,
        s.caption,
        s.hashtags,
        s.location,
        s.created_at as createdAt
    FROM snaps s
    ORDER BY s.created_at DESC
`);

const getSnapByIdStmt = db.prepare(`
    SELECT 
        s.*,
        '/uploads/' || s.image_path as imageUrl
    FROM snaps s 
    WHERE s.id = ?
`);

const updateSnapStmt = db.prepare('UPDATE snaps SET caption = ?, hashtags = ? WHERE id = ?');
const deleteSnapStmt = db.prepare('DELETE FROM snaps WHERE id = ?');
const markSnapAsViewedStmt = db.prepare(`
    INSERT OR IGNORE INTO views (snap_id, viewed_by) 
    VALUES (?, ?)
`);

function addSnap(username, imagePath, caption = '', hashtags = '', location = '') {
    const transaction = db.transaction(() => {
        // Get or create user
        let user = findUserStmt.get(username);
        if (!user) {
            const result = createUserStmt.run(username);
            user = { id: result.lastInsertRowid, username };
        }

        // Add snap
        const info = addSnapStmt.run(
            username,
            imagePath,
            caption,
            hashtags,
            location,
            user.id
        );

        // Get the created snap
        const snap = getSnapByIdStmt.get(info.lastInsertRowid);
        
        return {
            id: snap.id,
            username: snap.username,
            imageUrl: `/uploads/${snap.image_path}`,
            caption: snap.caption,
            hashtags: snap.hashtags,
            location: snap.location,
            createdAt: snap.created_at
        };
    });

    try {
        return transaction();
    } catch (error) {
        console.error('Error adding snap:', error);
        throw error;
    }
}

function getAllSnaps() {
    try {
        return getAllSnapsStmt.all();
    } catch (error) {
        console.error('Error getting all snaps:', error);
        return [];
    }
}

function getSnapById(id) {
    try {
        return getSnapByIdStmt.get(id);
    } catch (error) {
        console.error(`Error getting snap ${id}:`, error);
        return null;
    }
}

function updateSnap(id, caption, hashtags) {
    try {
        updateSnapStmt.run(caption, hashtags, id);
        return true;
    } catch (error) {
        console.error(`Error updating snap ${id}:`, error);
        return false;
    }
}

function deleteSnap(id) {
    try {
        // First get the snap to delete its image file
        const snap = getSnapById(id);
        if (snap && snap.image_path) {
            const imagePath = path.join(__dirname, 'public', 'uploads', path.basename(snap.image_path));
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image file:', err);
            });
        }
        
        // Then delete the database record
        const result = deleteSnapStmt.run(id);
        return result.changes > 0;
    } catch (error) {
        console.error(`Error deleting snap ${id}:`, error);
        return false;
    }
}

function markSnapAsViewed(snapId, userId) {
    try {
        markSnapAsViewedStmt.run(snapId, userId);
        return true;
    } catch (error) {
        console.error('Error marking snap as viewed:', error);
        return false;
    }
}

function getOrCreateUser(username) {
    let user = findUserStmt.get(username);
    if (!user) {
        const result = createUserStmt.run(username);
        user = { id: result.lastInsertRowid, username };
    }
    return user;
}

module.exports = {
    // User functions
    getOrCreateUser,
    
    // Snap functions
    addSnap,
    getAllSnaps,
    getSnapById,
    updateSnap,
    deleteSnap,
    markSnapAsViewed,
    
    // Direct db access for transactions
    db
};
