import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterUser } from "@/domain/use-cases/register-user"
import { LoginUser } from "@/domain/use-cases/login-user";

const router = Router();

// Inyección manual de dependencias
const userRepository = new UserRepository();
const loginUseCase = new LoginUser(userRepository);
const registerUseCase = new RegisterUser(userRepository);
const authController = new AuthController(registerUseCase, loginUseCase);


router.post("/register", (req, res)=> authController.register(req, res));
router.post("/login", (req, res)=> authController.login(req, res));

export default router;