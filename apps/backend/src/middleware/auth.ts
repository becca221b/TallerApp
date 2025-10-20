import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "clave_secreta_dev";

interface JwtPayload {
  id: string;
  email: string;
  role: "supervisor" | "empleado";
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    (req as any).user = decoded; // guardamos el usuario decodificado en la request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}
