import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

// In-memory user storage (for demonstration - in production use a database)
export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  isVip?: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;
}

export let users: User[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      passwordHash,
      createdAt: new Date(),
      isVip: false
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration Successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt,
        isVip: newUser.isVip,
        subscriptionPlan: newUser.subscriptionPlan,
        subscriptionExpiresAt: newUser.subscriptionExpiresAt
      }
    });
  } catch (error) {
    console.error('[Auth Controller] Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        isVip: user.isVip,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiresAt: user.subscriptionExpiresAt
      }
    });
  } catch (error) {
    console.error('[Auth Controller] Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};
