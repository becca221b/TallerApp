import { Router } from "express";
import { EmployeeController } from "../controllers/employee-controller";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
import { authenticate, authorize } from "../config/jwt";

const router = Router();

// Inyección manual de dependencias
const employeeRepository = new EmployeeRepository();
const employeeController = new EmployeeController(employeeRepository);

// Employee routes
router.post("/", authenticate, authorize("supervisor"), (req, res) => employeeController.createEmployee(req, res));
router.get("/", authenticate, authorize("supervisor"), (req, res) => employeeController.getAllEmployees(req, res));
router.get("/:id", authenticate, authorize("supervisor"), (req, res) => employeeController.getEmployee(req, res));
router.put("/:id", authenticate, authorize("supervisor"), (req, res) => employeeController.updateEmployee(req, res));
router.delete("/:id", authenticate, authorize("supervisor"), (req, res) => employeeController.deleteEmployee(req, res));
router.get("/type/:type", authenticate, authorize("supervisor"), (req, res) => employeeController.getEmployeesByType(req, res));
router.get("/username/:username", authenticate, (req, res) => employeeController.getEmployeeByUsername(req, res));

export default router;