import { Context } from 'hono';
import Note from '../models/note.model';
import { createNoteSchema, updateNoteSchema } from '../validation/note.schema';

export const createNote = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const validatedData = createNoteSchema.parse(body);

    const note = await Note.create({
      ...validatedData,
      userId,
    });

    return c.json({
      message: 'Note created successfully',
      note,
    }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    return c.json({ error: 'Failed to create note', message: error.message }, 500);
  }
};

export const getNotes = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const search = c.req.query('search') || '';

    const query: any = {
      userId,
      isDeleted: false,
    };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return c.json({
      notes,
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch notes', message: error.message }, 500);
  }
};

export const getNote = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const noteId = c.req.param('id');

    const note = await Note.findOne({
      _id: noteId,
      userId,
      isDeleted: false,
    });

    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }

    return c.json({ note });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch note', message: error.message }, 500);
  }
};

export const updateNote = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const noteId = c.req.param('id');
    const body = await c.req.json();
    const validatedData = updateNoteSchema.parse(body);

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId, isDeleted: false },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }

    return c.json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update note', message: error.message }, 500);
  }
};

export const deleteNote = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const noteId = c.req.param('id');

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }

    return c.json({
      message: 'Note deleted successfully',
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to delete note', message: error.message }, 500);
  }
};


