import { Context } from 'hono';
import Note from '../models/note.model';

const getAIMLConfig = () => {
  return {
    apiKey: process.env.AIML_API_KEY || process.env.GEMINI_API_KEY || '',
    apiUrl: process.env.AIML_API_URL || 'https://api.aimlapi.com/v1/chat/completions',
    // Use a basic model that doesn't require verification
    // You can change this to any model available in your account
    model: process.env.AIML_MODEL || 'deepseek-chat',
  };
};

async function callAIML(prompt: string, systemPrompt: string) {
  const config = getAIMLConfig();
  
  if (!config.apiKey) {
    throw new Error('AI/ML API key not configured. Set AIML_API_KEY in .env');
  }

  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as any;
    throw new Error(error.error?.message || error.message || 'AI/ML API error');
  }

  const data = await response.json() as any;
  return data.choices?.[0]?.message?.content || data.content || '';
}

export const generateSummary = async (c: Context) => {
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

    const systemPrompt = 'You are a helpful assistant that creates concise summaries. Summarize the given text in 2-3 sentences.';
    const summary = await callAIML(note.content, systemPrompt);

    return c.json({
      summary,
    });
  } catch (error: any) {
    return c.json({ 
      error: 'Failed to generate summary', 
      message: error.message 
    }, 500);
  }
};

export const improveNote = async (c: Context) => {
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

    const systemPrompt = 'You are a helpful writing assistant. Improve the given text for grammar, clarity, and readability while maintaining the original meaning and style. Return only the improved text without any explanations.';
    const improvedContent = await callAIML(note.content, systemPrompt);

    return c.json({
      improvedContent,
    });
  } catch (error: any) {
    return c.json({ 
      error: 'Failed to improve note', 
      message: error.message 
    }, 500);
  }
};

export const generateTags = async (c: Context) => {
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

    const systemPrompt = 'You are a helpful assistant. Analyze the given text and generate 3-5 relevant tags (single words or short phrases). Return only a comma-separated list of tags, nothing else.';
    const tagsString = await callAIML(note.content, systemPrompt);
    const tags = tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);

    return c.json({
      tags,
    });
  } catch (error: any) {
    return c.json({ 
      error: 'Failed to generate tags', 
      message: error.message 
    }, 500);
  }
};

