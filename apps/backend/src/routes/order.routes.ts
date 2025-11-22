import { Router } from "express";
import { OrderController } from "../controllers/order-controller";
import { OrderRepository } from "../repositories/OrderRepository";
import { GarmentRepository } from "../repositories/GarmentRepository";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { authenticate, authorize } from "../config/jwt";

const router = Router();

// Inyección manual de dependencias
const orderRepository = new OrderRepository();
const garmentRepository = new GarmentRepository();
const employeeRepository = new EmployeeRepository();
const orderController = new OrderController(orderRepository, garmentRepository,employeeRepository);

// Order routes
router.post("/", authenticate, authorize("supervisor") ,(req, res) => orderController.createOrder(req, res));
router.put("/assign", authenticate, authorize("supervisor"), (req, res) => orderController.assignOrder(req, res));
router.get("/employee/:employeeId", authenticate, (req, res) => orderController.getOrdersByEmployeeId(req, res));
router.put("/update-status", authenticate, (req, res) => orderController.updateOrderStatus(req, res));
router.get("/", authenticate, (req, res) => orderController.getOrders(req, res));

export default router;