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
        findEmployeeById: vi.fn().mockImplementation(async (id: string) => {
            return employees.find(employee => employee.id === id) || null;
        }),
        findEmployeesByType: vi.fn().mockImplementation(async (type: import('../entities/Employee').employeeType) => {
            return employees.filter(employee => employee.employeeType === type);
        }),
        updateEmployee: vi.fn().mockImplementation(async (id: string, employeeUpdate: Partial<Employee>) => {
            const employeeIndex = employees.findIndex(employee => employee.id === id);
            if (employeeIndex !== -1) {
                employees[employeeIndex] = { ...employees[employeeIndex], ...employeeUpdate } as Employee;
                return employees[employeeIndex];
            }
            return null;
        }),
        deleteEmployee: vi.fn().mockImplementation(async (id: string) => {
            const employeeIndex = employees.findIndex(employee => employee.id === id);
            if (employeeIndex !== -1) {
                employees.splice(employeeIndex, 1);
                return true;
            }
            return false;
        }),
        findAllEmployees: vi.fn().mockImplementation(async () => {
            return [...employees];
        }),
        findEmployeeByUsername: vi.fn().mockImplementation(async (username: string) => {
            return employees.find(employee => employee.username === username) || null;
        })
    };
};
