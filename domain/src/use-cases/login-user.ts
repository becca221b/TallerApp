import { UserService } from "../services/user-service";
import bcrypt from "bcrypt";
import type { User } from "../entities/User";
import jwt from "jsonwebtoken";

interface LoginUserDTO {
  username: string;
  password: string;
}

export class LoginUser {
  constructor(private userService: UserService) {}

  async execute(dto: LoginUserDTO): Promise<{token: string, user: User}> {
    // Try to find the user by username
    const user = await this.userService.findUserByName(dto.username);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.passwordHash) {
      // Verify the password
      const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error("Contraseña incorrecta");
      }
    } 

    const token = jwt.sign({ 
      username: user.username,
      role: user.role,
    },"clave_secreta_dev", { expiresIn: "1h" });
    return { token, user };
    
  }
}
