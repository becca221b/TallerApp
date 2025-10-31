import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { UserRepository } from "../repositories/UserRepository";


const router = Router();

// Inyección manual de dependencias
const userRepository = new UserRepository();
const authController = new AuthController(userRepository);


router.post("/register", (req, res)=> authController.register(req, res));
router.post("/login", (req, res)=> authController.login(req, res));

export default router;