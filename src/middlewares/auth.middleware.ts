import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

// Augment Express Request with `user`
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sector: string | null;
      };
    }
  }
}

interface TokenPayload {
  sub: string;  // subject: typically the userId
  iat: number;
  exp: number;
}

export const isAuthenticated: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload: TokenPayload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      return;
    }

    // Fetch user with sector info
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, sector: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    req.user = {
      id: user.id,
      sector: user.sector,
    };

    next();
  } catch (err) {
    console.error('Authentication Middleware Error:', err);
    res.status(500).json({ error: 'Internal server error in authentication' });
  }
};