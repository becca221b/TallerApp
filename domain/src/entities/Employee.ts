export interface Employee {
    readonly id: string,
    name: string,
    surname: string,
    documentNumber: string,
    phone: string,
    isActive: boolean,
    email?: string
}