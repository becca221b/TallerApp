import { EmployeeService } from "../services/employee-service";
import { Employee } from "../entities/Employee";

export class CreateEmployee {
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
      
        if(!employee.employeeType || employee.employeeType.trim() === '') {
            throw new Error('Employee type is required');
        }
        if(employee.employeeType!= 'Cortador' && employee.employeeType!= 'Costurero' && employee.employeeType!= 'Supervisor'){{
            throw new Error('Employee type must be Cortador, Costurero, or Supervisor');
        }}
    }
}