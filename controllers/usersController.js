// controllers/usersController.js
import { createUser, findUserByEmail, findUserByCredentials } from '../models/user.js';
import { verifyUserCredentials } from '../models/user.js';
import { generateToken } from '../util/auth.js'; // Import the function

export async function signup(req, res) {
    const { email, password } = req.body;

    // Trim input to remove leading/trailing spaces
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPassword = typeof password === 'string' ? password.trim() : '';

    // Email validation regex (simple version)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !trimmedPassword) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ message: 'Invalid email address.' });
    }
    if (trimmedPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    const existingUser = findUserByEmail(trimmedEmail);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
    }
    const result = await createUser(trimmedEmail, trimmedPassword);
    const newUser = { id: result.lastInsertRowid, email: trimmedEmail };
    const token = generateToken(newUser); // Generate JWT
    res.status(201).json({ message: 'User registered successfully.', user: newUser, token });
}

export async function login(req, res) {
    try {
        const { email, password } = req.body; 
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const trimmedPassword = typeof password === 'string' ? password.trim() : '';
        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await verifyUserCredentials(trimmedEmail, trimmedPassword);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Exclude password from response
        const { password: _pw, ...userData } = user;
        const token = generateToken(userData); // Generate JWT
        res.status(200).json({ message: 'Login successful.', user: userData, token });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred during login.', error: error.message });
    }
}
