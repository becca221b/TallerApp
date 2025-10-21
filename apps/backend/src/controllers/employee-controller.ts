import { Request, Response } from 'express';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { Employee, employeeType } from '@/domain/entities/Employee';

export class EmployeeController {
    constructor(
        private readonly employeeRepository: EmployeeRepository
    ) {}

    async createEmployee(req: Request, res: Response) {
        try {
            const employeeData: Employee = req.body;

            // Validate required fields
            if (!employeeData.name || !employeeData.surname || !employeeData.documentNumber || !employeeData.phone || !employeeData.employeeType) {
                return res.status(400).json({ 
                    error: 'Missing required fields. Required: name, surname, documentNumber, phone, employeeType' 
                });
            }

            const employee = await this.employeeRepository.saveEmployee(employeeData);
            res.status(201).json(employee);
        } catch (error) {
            console.error('Error creating employee:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error while creating employee' });
            }
        }
    }

    async getEmployee(req: Request, res: Response) {
        try {
            const employeeId = req.params.id;
            if (!employeeId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const employee = await this.employeeRepository.findEmployeeById(employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.status(200).json(employee);
        } catch (error) {
            console.error('Error getting employee:', error);
            res.status(500).json({ error: 'Internal server error while fetching employee' });
        }
    }

    async getEmployeesByType(req: Request, res: Response) {
        try {
            const type = req.params.type as employeeType;
            if (!type) {
                return res.status(400).json({ error: 'Employee type is required' });
            }

            // Validate employee type
            if (!['Costurero', 'Cortador', 'Supervisor'].includes(type)) {
                return res.status(400).json({ error: 'Invalid employee type' });
            }

            const employees = await this.employeeRepository.findEmployeesByType(type);
            res.status(200).json(employees);
        } catch (error) {
            console.error('Error getting employees by type:', error);
            res.status(500).json({ error: 'Internal server error while fetching employees' });
        }
    }

    async updateEmployee(req: Request, res: Response) {
        try {
            const employeeId = req.params.id;
            const updateData: Partial<Employee> = req.body;

            if (!employeeId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const updatedEmployee = await this.employeeRepository.updateEmployee(employeeId, updateData);
            if (!updatedEmployee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.status(200).json(updatedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error while updating employee' });
            }
        }
    }

    async deleteEmployee(req: Request, res: Response) {
        try {
            const employeeId = req.params.id;
            if (!employeeId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const deleted = await this.employeeRepository.deleteEmployee(employeeId);
            if (!deleted) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({ error: 'Internal server error while deleting employee' });
        }
    }

    async getAllEmployees(req: Request, res: Response) {
        try {
            const employees = await this.employeeRepository.findAllEmployees();
            res.status(200).json(employees);
        } catch (error) {
            console.error('Error getting all employees:', error);
            res.status(500).json({ error: 'Internal server error while fetching employees' });
        }
    }
}

// Factory function to create the controller with dependencies
export const createEmployeeController = (employeeRepository: EmployeeRepository) => {
    return new EmployeeController(employeeRepository);
};


