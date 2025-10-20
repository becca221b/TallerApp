import { Router } from 'express';
import { createOrderController } from '../controllers/order-controller';
import { OrderRepository } from '../repositories/OrderRepository';
import { GarmentRepository } from '../repositories/GarmentRepository';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

const router = Router();

// Initialize repositories
const orderRepository = new OrderRepository();
const garmentRepository = new GarmentRepository();
const employeeRepository = new EmployeeRepository();

// Create controller with dependencies
const orderController = createOrderController(
    orderRepository,
    garmentRepository,
    employeeRepository
);

// Order routes
router.post('/orders', orderController.createOrder.bind(orderController));
router.post('/orders/assign', orderController.assignOrder.bind(orderController));
router.get('/orders/:id', orderController.getOrder.bind(orderController));
router.get('/orders/customer/:customerId', orderController.getOrdersByCustomer.bind(orderController));
router.get('/orders/employee/:employeeId', orderController.getOrdersByEmployee.bind(orderController));

export default router;