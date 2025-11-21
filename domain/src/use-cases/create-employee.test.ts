import type { Employee } from '../entities/Employee.js';
import { describe, it, expect, vi } from 'vitest';
import { createMockEmployeeService } from '../mocks/mock-employee-service.js';

describe('Create an employee',()=>{
    it('should create an employee', async()=>{
        const mockEmployeeService = createMockEmployeeService();

        const newEmployee: Employee = {
            id: '1',
            name: 'John',
            surname: 'Doe',
            documentNumber: '12345678',
            phone: '555-5555',
            isActive: true,
            employeeType: 'costurero',
            username: '',
            password: ''
        }
        const savedEmployee = await mockEmployeeService.saveEmployee(newEmployee);
        expect(savedEmployee).toEqual(newEmployee);
        expect(mockEmployeeService.saveEmployee).toHaveBeenCalledWith(newEmployee);

    })

    it('should create an employee and set username and password', async()=>{
        const mockEmployeeService = createMockEmployeeService();
        const createEmployeeUseCase = new (await import('./create-employee')).CreateEmployee(mockEmployeeService);

        const newEmployee: Employee = {
            id: '1',
            name: 'Jane',
            documentNumber: '87654321',
            surname: 'Smith',
            phone: '555-1234',
            employeeType: 'cortador',
            
        }

        const savedEmployee = await createEmployeeUseCase.saveEmployee(newEmployee);
        expect(savedEmployee.username).toBe('JaneSmith');
        expect(savedEmployee.password).toBe('87654321');
        expect(savedEmployee.isActive).toBe(true);
        expect(mockEmployeeService.saveEmployee).toHaveBeenCalledWith(savedEmployee);
    });

    describe('Validation errors',()=>{
        it('should throw error if employeeType is not Cortador, Costurero, or Supervisor', async()=>{
            const mockEmployeeService = createMockEmployeeService();
            const createEmployeeUseCase = new (await import('./create-employee')).CreateEmployee(mockEmployeeService);

            const newEmployee: Employee = {
                id: '1',
                name: 'Sarah',
                surname: 'Connor',
                documentNumber: '00000000',
                phone: '555-0000',
                employeeType: 'Manager' as any, // Invalid type
            }

            const savedEmployee = createEmployeeUseCase.saveEmployee(newEmployee);
            await expect(savedEmployee).rejects.toThrow('Employee type must be Cortador, Costurero, or Supervisor');
            expect(mockEmployeeService.saveEmployee).not.toHaveBeenCalled();
        })
    })

})


