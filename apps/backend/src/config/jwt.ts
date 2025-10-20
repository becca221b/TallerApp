import jwt from "jsonwebtoken";
import { User } from '@/domain/entities'

const SECRET = process.env.JWT_SECRET || "clave_secreta_dev";

export function generateToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );
}
