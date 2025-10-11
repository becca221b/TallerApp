import { EmployeeService } from "../services/employee-service";
import { Employee } from "../entities/Employee";

export class CreateEmployee implements EmployeeService{
    constructor(private readonly employeeService: EmployeeService){}

    async saveEmployee(employee: Employee): Promise<Employee> {
        // Set defaults when fields are missing
        employee.username = employee.username ?? (employee.name + (employee.surname ?? ''));
        employee.password = employee.password ?? employee.documentNumber;
        employee.isActive = employee.isActive ?? true;

        //Validations before saving the employee
        this.validateEmployee(employee);

        //Delegate the persistency to service
        return await this.employeeService.saveEmployee(employee);
    }

    private validateEmployee(employee: Employee): void {
        if (!employee.name || employee.name.trim() === '') {
            throw new Error('Employee name is required');
        }

        if(!employee.documentNumber || employee.documentNumber.trim() === '') {
            throw new Error('Document number is required');
        }
        
    }
}