import { Hono } from 'hono';
import { generateSummary, improveNote, generateTags } from '../controller/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const aiRoutes = new Hono();

aiRoutes.use('/*', authMiddleware);

aiRoutes.post('/notes/:id/summary', generateSummary);
aiRoutes.post('/notes/:id/improve', improveNote);
aiRoutes.post('/notes/:id/tags', generateTags);

export default aiRoutes;


