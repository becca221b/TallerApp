import { Request, Response } from "express";
import { RegisterUser } from "@/domain/use-cases/register-user";
import { LoginUser } from "@/domain/use-cases/login-user";
import { UserRepository } from "src/repositories/UserRepository";

export class AuthController {

  constructor (private userRepository: UserRepository) {}
  
  async register(req: Request, res: Response):Promise<void> {

    try {
      const { username, password, role } = req.body;
     
      const user = await new RegisterUser(this.userRepository).execute({ username, password, role });
      res.status(201).json({ message: "Usuario registrado exitosamente", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response):Promise<void> {
    const { username, password } = req.body;
    
    try {
         
      const{ token, user } = await new LoginUser(this.userRepository).execute({ username, password });
      
      res.status(200).json({ token, user, message: "Login exitoso" });
    } catch (error: any) {
      
      res.status(401).json({ message:'Invalid credentials', error: error.message });
    }
  }
}
