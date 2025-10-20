import { Request, Response, NextFunction } from "express";

export function authorization(...allowedRoles: ("supervisor" | "empleado")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }

    next();
  };
}
