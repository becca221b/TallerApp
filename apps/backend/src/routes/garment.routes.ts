import { Router } from "express";
import { GarmentController } from "../controllers/garment-controller";
import { authenticate, authorize } from "../config/jwt";
import { GarmentRepository } from "../repositories/GarmentRepository";

const router = Router();

const garmentRepository = new GarmentRepository();
const garmentController = new GarmentController(garmentRepository);

// Garment routes
router.post("/", authenticate, authorize("supervisor"), (req, res) => garmentController.createGarment(req, res));
router.get("/:id", authenticate, (req, res) => garmentController.getGarment(req, res));
router.get("/", authenticate, (req, res) => garmentController.getAllGarments(req, res));

export default router;