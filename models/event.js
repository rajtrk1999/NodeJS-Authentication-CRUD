import db from '../dataBase.js';

// Create a new event
export function createEvent({ title, description, address, date, image, userId }) {
    const stmt = db.prepare('INSERT INTO events (title, description, address, date, image, user_id) VALUES (?, ?, ?, ?, ?, ?)');
    return stmt.run(title, description, address, date, image, userId);
}

// Update an event by ID
export function updateEvent(id, { title, description, address, date, image }) {
    const stmt = db.prepare('UPDATE events SET title = ?, description = ?, address = ?, date = ?, image = ? WHERE id = ?');
    return stmt.run(title, description, address, date, image, id);
}

// Delete an event by ID
export function deleteEvent(id) {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    return stmt.run(id);
}

// Get all events
export function getAllEvents() {
    const stmt = db.prepare('SELECT * FROM events');
    return stmt.all();
}

// Get a single event by ID
export function getEventById(id) {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    return stmt.get(id);
}

// Register a user for an event
export function registerUserForEvent(userId, eventId) {
    const stmt = db.prepare('INSERT OR IGNORE INTO registrations (user_id, event_id) VALUES (?, ?)');
    return stmt.run(userId, eventId);
}

// Unregister a user from an event
export function unregisterUserFromEvent(userId, eventId) {
    const stmt = db.prepare('DELETE FROM registrations WHERE user_id = ? AND event_id = ?');
    return stmt.run(userId, eventId);
}