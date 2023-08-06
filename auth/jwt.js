import jwt from 'jsonwebtoken';
import { roles } from '../utils/roles.js';
import { configDotenv } from 'dotenv';
configDotenv();

const { JWT_SECRET_KEY } = process.env;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

export const authorizeRole = (role) => (req, res, next) => {
    if (parseInt(req.user.role) !== role) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

// export default { authenticateToken, authorizeRole }token;