import { UserService } from "../services/user-service";
import bcrypt from "bcrypt";
import type { User } from "../entities/User";

interface LoginUserDTO {
  username: string;
  password: string;
}

export class LoginUser {
  constructor(private userService: UserService) {}

  async execute(dto: LoginUserDTO): Promise<User> {
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

    return user;
  }
}
