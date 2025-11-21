import { Router } from "express";
import { CustomerController } from "../controllers/customer-controller";
import { authenticate, authorize } from "src/config/jwt";
import { CustomerRepository } from "../repositories/CustomerRepository";

const router = Router();

const customerRepository = new CustomerRepository();
const customerController = new CustomerController(customerRepository);

// Customer routes
router.post("/", authenticate, authorize("supervisor"), (req, res) => customerController.createCustomer(req, res));
router.get("/:id", authenticate, (req, res) => customerController.getCustomer(req, res));
router.get("/", authenticate, (req, res) => customerController.getAllCustomers(req, res));

export default router;
