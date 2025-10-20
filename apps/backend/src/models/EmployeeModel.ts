import { Schema, model } from 'mongoose';
import { Employee, employeeType } from '@/domain/entities/Employee';

const EmployeeSchema = new Schema<Employee>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    documentNumber: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    employeeType: { 
        type: String,
        enum: ['Costurero', 'Cortador', 'Supervisor'],
        required: true 
    },
    username: { type: String },
    password: { type: String }
}, { timestamps: true });

export const EmployeeModel = model<Employee>('Employee', EmployeeSchema);