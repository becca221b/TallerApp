import type { EmployeeService } from "../services/employee-service.js";
import type { Employee } from "../entities/Employee.js";

export class CreateEmployee {
    constructor(private readonly employeeService: EmployeeService){}

    async saveEmployee(employee: Employee): Promise<Employee> {
        employee.username = employee.username ?? (employee.name + (employee.surname ?? ''));
        employee.password = employee.password ?? employee.documentNumber;
        employee.isActive = employee.isActive ?? true;

        this.validateEmployee(employee);

        return await this.employeeService.saveEmployee(employee);
    }

    private validateEmployee(employee: Employee): void {
        if (!employee.name || employee.name.trim() === '') {
            throw new Error('Employee name is required');
        }

        if(!employee.documentNumber || employee.documentNumber.trim() === '') {
            throw new Error('Document number is required');
        }

        if(!employee.employeeType || employee.employeeType.trim() === '') {
            throw new Error('Employee type is required');
        }
        if(employee.employeeType!= 'Cortador' && employee.employeeType!= 'Costurero' && employee.employeeType!= 'Supervisor'){{
            throw new Error('Employee type must be Cortador, Costurero, or Supervisor');
        }}
    }
}
