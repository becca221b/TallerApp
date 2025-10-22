import { EmployeeService } from "@/domain/services/employee-service";
import { EmployeeModel } from "../models/EmployeeModel";
import { Employee, employeeType } from "@/domain/entities/Employee";

export class EmployeeRepository implements EmployeeService {
    
    async saveEmployee(employee: Employee): Promise<Employee> {
        const newEmployee = await EmployeeModel.create(employee);
        // Transform the Mongoose document to Employee type
        const employeeData: Employee = {
            id: newEmployee._id.toString(),
            name: newEmployee.name,
            surname: newEmployee.surname,
            documentNumber: newEmployee.documentNumber,
            phone: newEmployee.phone,
            employeeType: newEmployee.employeeType,
            username: newEmployee.username,
            password: newEmployee.password
        };
        return employeeData;
    }

    async findEmployeeById(id: string): Promise<Employee | null> {
        const employee = await EmployeeModel.findById(id);
        if (!employee) return null;
        
        return {
            id: employee._id.toString(),
            name: employee.name,
            surname: employee.surname,
            documentNumber: employee.documentNumber,
            phone: employee.phone,
            employeeType: employee.employeeType,
            username: employee.username,
            password: employee.password
        };
    }
    
    async findEmployeesByType(type: employeeType): Promise<Employee[]>{
        const employees = await EmployeeModel.find({ employeeType: type });
        return employees.map(employee => ({
            id: employee._id.toString(),
            name: employee.name,
            surname: employee.surname,
            documentNumber: employee.documentNumber,
            phone: employee.phone,
            employeeType: employee.employeeType,
            username: employee.username,
            password: employee.password
        }));
    }
    
    async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null> {
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            { $set: employee },
            { new: true }
        );
        
        if (!updatedEmployee) {
            return null;
        }

        return {
            id: updatedEmployee._id.toString(),
            name: updatedEmployee.name,
            surname: updatedEmployee.surname,
            documentNumber: updatedEmployee.documentNumber,
            phone: updatedEmployee.phone,
            employeeType: updatedEmployee.employeeType,
            username: updatedEmployee.username,
            password: updatedEmployee.password
        };
    }
    async deleteEmployee(id: string): Promise<boolean> {
        const result = await EmployeeModel.findByIdAndDelete(id);
        return result !== null;
    }
    async findAllEmployees(): Promise<Employee[]> {
        const employees = await EmployeeModel.find();
        return employees.map(employee => ({
            id: employee._id.toString(),
            name: employee.name,
            surname: employee.surname,
            documentNumber: employee.documentNumber,
            phone: employee.phone,
            employeeType: employee.employeeType,
            username: employee.username,
            password: employee.password
        }));
    }
        
        
}
