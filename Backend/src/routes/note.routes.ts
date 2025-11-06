import { Hono } from 'hono';
import { createNote, getNotes, getNote, updateNote, deleteNote } from '../controller/note.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const noteRoutes = new Hono();

noteRoutes.use('/*', authMiddleware);

noteRoutes.post('/', createNote);
noteRoutes.get('/', getNotes);
noteRoutes.get('/:id', getNote);
noteRoutes.put('/:id', updateNote);
noteRoutes.delete('/:id', deleteNote);

export default noteRoutes;

