import type { Employee } from "../entities/Employee";

export interface EmployeeService {
    saveEmployee(employee: Employee): Promise<Employee>;
   
}