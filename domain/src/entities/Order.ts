import { OrderDetail } from "./OrderDetail";

export type orderStatus = 'pending' | 'in process' | 'completed' ;


export interface Order{
    id: string,
    customerId: string,
    status: orderStatus,
    totalPrice?: number,
    employeeId: string,
    orderDetails: OrderDetail[],
    orderDate: Date,
    deliveryDate: Date,
}