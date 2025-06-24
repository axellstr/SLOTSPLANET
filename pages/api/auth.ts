import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Simple authentication - in production, use proper hashed passwords and database
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// Simple session store - in production, use Redis or database
const activeSessions = new Set<string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password, action } = req.body;

    if (action === 'login') {
      // Validate credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Generate session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        activeSessions.add(sessionToken);

        // Set session expiry (24 hours)
        setTimeout(() => {
          activeSessions.delete(sessionToken);
        }, 24 * 60 * 60 * 1000);

        return res.status(200).json({
          success: true,
          token: sessionToken,
          message: 'Login successful'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    if (action === 'logout') {
      const { token } = req.body;
      if (token) {
        activeSessions.delete(token);
      }
      return res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    }

    if (action === 'verify') {
      const { token } = req.body;
      const isValid = activeSessions.has(token);
      return res.status(200).json({
        success: true,
        valid: isValid
      });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
} 