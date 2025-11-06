import { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token) as any;
    
    if (!decoded || !decoded.userId) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('userId', decoded.userId);
    await next();
  } catch (error: any) {
    return c.json({ error: 'Authentication failed', message: error.message }, 401);
  }
};


