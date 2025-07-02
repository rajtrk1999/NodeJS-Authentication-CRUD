// models/user.js
// Simple in-memory user store (no database)
import db from '../dataBase.js';
import bcrypt from 'bcryptjs';

// Create a new user
export async function createUser(email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        const result = stmt.run(email, hash); // Ensure result is returned
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Verify user credentials (email and password) with error handling
// The db query IS required here to fetch the user by email for password comparison.
// This is done in the verifyUserCredentials function using findUserByEmail(email).
export async function verifyUserCredentials(email, password) {
    try {
        const user = findUserByEmail(email); // Gets user from DB by email
        if (!user) return false;
        const isMatch = await bcrypt.compare(password, user.password); // Compares input password with hashed password from DB
        return isMatch ? user : false;
    } catch (error) {
        console.error('Error verifying user credentials:', error);
        return false;
    }
}

// Find a user by email
export function findUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
}

// Find a user by email and password
export function findUserByCredentials(email, password) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    return stmt.get(email, password);
}
