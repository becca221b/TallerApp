import { Employee } from "../entities/Employee";

export interface EmployeeService {
    saveEmployee(employee: Employee): Promise<Employee>;
    findEmployeeById(id: string): Promise<Employee | null>;
    findEmployeeByName(name: string): Promise<Employee | null>;
    updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null>;
}