import { Router } from 'express';
import { createCustomerController } from '../controllers/customer-controller';
import { CustomerRepository } from '../repositories/CustomerRepository';

const router = Router();

// Initialize repository
const customerRepository = new CustomerRepository();

// Create controller with dependencies
const customerController = createCustomerController(customerRepository);

// Customer routes
router.post('/customers', customerController.createCustomer.bind(customerController));
router.get('/customers/:id', customerController.getCustomer.bind(customerController));


export default router;
