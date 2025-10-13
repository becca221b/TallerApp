import { OrderDetail } from "../entities/OrderDetail";

export interface OrderDetailService{
    saveMany(orderDetails: Omit<OrderDetail,'id'>[]): Promise<OrderDetail[]>;
    //findByOrderId(orderId: number): Promise<OrderDetail[]>;
    //deleteByOrderId(orderId: number): Promise<void>;
}