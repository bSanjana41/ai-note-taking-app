import { Context } from 'hono';
import User from '../models/user.model';
import { registerSchema, loginSchema } from '../validation/auth.schema';
import { generateToken } from '../utils/jwt';
import * as bcrypt from 'bcryptjs';

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email, isDeleted: false });
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    // Generate token
    const token = await generateToken({ userId: user._id, email: user.email });

    return c.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }, 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    return c.json({ error: 'Registration failed', message: error.message }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await User.findOne({ email: validatedData.email, isDeleted: false });
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return c.json({ error: 'Account is deactivated' }, 403);
    }

    // Generate token
    const token = await generateToken({ userId: user._id, email: user.email });

    return c.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    return c.json({ error: 'Login failed', message: error.message }, 500);
  }
};

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const user = await User.findById(userId).select('-password');
    
    if (!user || user.isDeleted) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch profile', message: error.message }, 500);
  }
};

export const verifyToken = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const user = await User.findById(userId).select('-password');
    
    if (!user || user.isDeleted) {
      return c.json({ error: 'User not found', valid: false }, 404);
    }

    if (!user.isActive) {
      return c.json({ error: 'Account is deactivated', valid: false }, 403);
    }

    return c.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    return c.json({ 
      valid: false,
      error: 'Token verification failed', 
      message: error.message 
    }, 401);
  }
};

