import { OrderDetail } from "./OrderDetail";

export enum OrderStatus {
    Pending = 'pending',
    InProcess = 'in process',
    Completed = 'completed'
}

export interface Order {
    id: string,
    customerId: string,
    status?: OrderStatus,
    totalPrice?: number,
    employeeId: string,
    orderDetails: OrderDetail[],
    orderDate: Date,
    deliveryDate: Date,
}