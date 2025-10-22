import { Router } from "express";
import { OrderController } from "../controllers/order-controller";
import { OrderRepository } from "../repositories/OrderRepository";
import { GarmentRepository } from "../repositories/GarmentRepository";
import { EmployeeRepository } from "../repositories/EmployRepository";

const router = Router();

// Inyección manual de dependencias
const orderRepository = new OrderRepository();
const garmentRepository = new GarmentRepository();
const employeeRepository = new EmployeeRepository();
const orderController = new OrderController(orderRepository, garmentRepository,employeeRepository);

router.post("/", (req, res)=> orderController.createOrder(req, res));
router.post("/assign", (req, res)=> orderController.assignOrder(req, res));
//router.get("/employee/:employeeId", (req, res)=> orderController.getOrdersByEmployeeId(req, res));

export default router;