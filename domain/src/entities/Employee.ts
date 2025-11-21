export type employeeType = 'costurero' | 'cortador' | 'supervisor';

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
