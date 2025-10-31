import type { Employee, employeeType } from "../entities/Employee";

export interface EmployeeService {
    saveEmployee(employee: Employee): Promise<Employee>;
    findEmployeeById(id: string): Promise<Employee | null>;
    findEmployeesByType(type: employeeType): Promise<Employee[]>;
    updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null>;
    deleteEmployee(id: string): Promise<boolean>;
    findAllEmployees(): Promise<Employee[]>;
}