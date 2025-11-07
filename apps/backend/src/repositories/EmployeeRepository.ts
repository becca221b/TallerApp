import { EmployeeService } from '@/domain/services/employee-service';
import { Employee, employeeType } from '@/domain/entities/Employee';
import { EmployeeModel } from '../models/EmployeeModel';

export class EmployeeRepository implements EmployeeService {
    async saveEmployee(employee: Employee): Promise<Employee> {
        const employeeDoc = new EmployeeModel(employee);
        const savedEmployee = await employeeDoc.save();
        return savedEmployee.toJSON() as Employee;
    }

    async findEmployeeById(id: string): Promise<Employee | null> {
        const employee = await EmployeeModel.findOne({ id }).exec();
        return employee ? employee.toJSON() as Employee : null;
    }

    async findEmployeesByType(type: employeeType): Promise<Employee[]> {
        const employees = await EmployeeModel.find({ type }).exec();
        return employees.map(emp => emp.toJSON() as Employee);
    }
    async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null> {
        const updated = await EmployeeModel.findOneAndUpdate({ id }, employee, { new: true }).exec();
        return updated ? updated.toJSON() as Employee : null;
    }
    async deleteEmployee(id: string): Promise<boolean> {
        const result = await EmployeeModel.findOneAndDelete({ id }).exec();
        return result !== null;
    }
    async findAllEmployees(): Promise<Employee[]> {
        const employees = await EmployeeModel.find().exec();
        return employees.map(emp => emp.toJSON() as Employee);
    }
}
