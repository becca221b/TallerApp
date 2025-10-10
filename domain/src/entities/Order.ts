import { Garment } from "./Garment";

export type orderStatus = 'pending' | 'in process' | 'completed' ;
export type sex = 'F' | 'M';

export interface Order{
    id: string,
    garmentId: string,
    customerId: string,
    orderDate: Date,
    deliveryDate: Date,
    status: 'orderStatus',
    totalPrice: number,
    employeeId: string,
    size: string, // VER Types o enums
    quantity: number,
    sex: 'sex'
}