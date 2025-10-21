import { Request, Response } from "express";
import { RegisterUser } from "@/domain/use-cases/register-user";
import { LoginUser } from "@/domain/use-cases/login-user";
import { generateToken } from "../config/jwt";

export class AuthController {

  constructor (private registerUser: RegisterUser, private loginUser: LoginUser) {}
  
  async register(req: Request, res: Response):Promise<void> {
    try {
      const { username, password, role } = req.body;
     
      const user = await this.registerUser.execute({ username, password, role });
      res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response):Promise<void> {
    try {
      const { username, password } = req.body;
   
      const user = await this.loginUser.execute({ username, password });
      const token = generateToken(user);
      res.status(200).json({ message: "Login exitoso", token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
