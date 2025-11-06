import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';
import aiRoutes from './routes/ai.routes';
import { serve } from '@hono/node-server';

const app = new Hono();

// Middleware
app.use('/*', cors({
  origin: ['http://localhost:5000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get('/', (c) => {
  return c.json({ message: 'AI Note-Taking App API', status: 'running' });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/notes', noteRoutes);
app.route('/api/ai', aiRoutes);

// Connect to database and start server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;

connectDB().then(() => {
  console.log(`Starting server on port ${port}...`);
  serve({
    fetch: app.fetch,
    port: port,
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
