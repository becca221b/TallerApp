import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from '@/domain/entities'

const SECRET = process.env.JWT_SECRET || "test-secret";

export function generateToken(user: User) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );
}

//Verify user has a valid token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

//Verify user has a valid role
export const authorize = ( role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if(!user) {
      return res.status(403).json({ message: "Not authenticated" });
    }
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  }
}