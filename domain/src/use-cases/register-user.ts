import { UserService } from "../services/user-service"
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

interface RegisterUserDTO {
  username: string;
  password: string;
  role: "supervisor" | "empleado";
}

export class RegisterUser {
  constructor(private userService: UserService) {}

  async execute({ username, password, role}: RegisterUserDTO) {
    const existing = await this.userService.findUserByName(username);
    if (existing) throw new Error("El usuario ya existe");

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await this.userService.saveUser({
      id: randomUUID(),
      username,
      passwordHash: hashed,
      role: role as any,
    });
    
    return newUser;
  }
}
