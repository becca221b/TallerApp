import { Garment } from "./Garment";

export type orderStatus = 'pending' | 'in process' | 'completed' ;

export interface Order{
    id: string,
    garments: Garment[],
    customerId: string,
    orderDate: Date,
    deliveryDate: Date,
    status: 'orderStatus',
    totalPrice: number,
    employeeId: string
}