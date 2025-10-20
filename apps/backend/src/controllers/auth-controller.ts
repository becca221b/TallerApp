import { Request, Response } from "express";
import { RegisterUser } from "@/domain/use-cases/register-user";
import { LoginUser } from "@/domain/use-cases/login-user";
import { UserRepository } from "../repositories/UserRepository";;
import { generateToken } from "../config/jwt";

const userRepository = new UserRepository();

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      const registerUser = new RegisterUser(userRepository);
      const user = await registerUser.execute({ username, password, role });
      res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const loginUser = new LoginUser(userRepository);
      const user = await loginUser.execute({ username, password });
      const token = generateToken(user);
      res.status(200).json({ message: "Login exitoso", token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
