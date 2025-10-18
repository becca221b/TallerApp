export type employeeType = 'Costurero' | 'Cortador' | 'Supervisor';

export interface Employee {
    readonly id: string,
    name: string,
    surname: string,
    documentNumber: string,
    phone: string,
    isActive?: boolean,
    employeeType: employeeType,
    username?: string,
    password?: string
}
