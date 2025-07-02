import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abctesttoken'; // Replace with your actual secret key
const JWT_EXPIRES_IN = '1h'; // Token expiry time

// Generate JWT with user id and email
export function generateToken(user) {
    const payload = {
        userId: user.id,
        email: user.email
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT and return decoded payload
export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}
