import { vi } from 'vitest';
import type { EmployeeService } from '../services/employee-service';
import type { Employee } from '../entities/Employee';

export const createMockEmployeeService = (
    employees: Employee[] = []
): EmployeeService => {
    return {
        saveEmployee: vi.fn().mockImplementation(async (employee: Employee) => {
            employees.push(employee);
            return employee;
        }),
        
        
    };
};