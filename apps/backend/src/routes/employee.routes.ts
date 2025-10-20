import { Router } from 'express';
import { createEmployeeController } from '../controllers/employee-controller';
import { EmployeeRepository } from '../repositories/EmployeeRepository';

const router = Router();

// Initialize repository
const employeeRepository = new EmployeeRepository();

// Create controller with dependencies
const employeeController = createEmployeeController(employeeRepository);

// Employee routes
router.post('/employees', employeeController.createEmployee.bind(employeeController));
router.get('/employees/:id', employeeController.getEmployee.bind(employeeController));
router.get('/employees/type/:type', employeeController.getEmployeesByType.bind(employeeController));
router.put('/employees/:id', employeeController.updateEmployee.bind(employeeController));
router.delete('/employees/:id', employeeController.deleteEmployee.bind(employeeController));
router.get('/employees', employeeController.getAllEmployees.bind(employeeController));

export default router;
