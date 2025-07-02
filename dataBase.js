import Database from 'better-sqlite3';

// Open or create the database file
const db = new Database('users.db');

// Helper to create tables
function createTable(sql) {
    try {
        db.exec(sql);
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
}

// Users table
createTable(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
`);

// Events table
createTable(`
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT,
    date TEXT,
    image TEXT,
    user_id INTEGER,
    foreign key (user_id) references users(id) ON DELETE CASCADE
);
`);

// Registrations table
createTable(`
CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    event_id INTEGER,
    foreign key (user_id) references users(id) ON DELETE CASCADE,
    foreign key (event_id) references events(id) ON DELETE CASCADE
);
`);

export default db;