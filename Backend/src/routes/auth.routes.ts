import { Hono } from 'hono';
import { register, login, getProfile, verifyToken } from '../controller/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRoutes = new Hono();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/profile', authMiddleware, getProfile);
authRoutes.get('/verify', authMiddleware, verifyToken);

export default authRoutes;


