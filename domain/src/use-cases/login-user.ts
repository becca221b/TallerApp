import { UserService } from "../services/user-service";
import bcrypt from "bcrypt";

interface LoginUserDTO {
  username: string;
  password: string;
}

export class LoginUser {
  constructor(private userRepository: UserService) {}

  async execute({ username, password }: LoginUserDTO) {
    const user = await this.userRepository.findUserByName(username);
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Contraseña incorrecta");

    return user;
  }
}
