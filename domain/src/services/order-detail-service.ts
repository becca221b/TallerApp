import type { OrderDetail } from "../entities/OrderDetail.js";

export interface OrderDetailService {
    saveMany(orderDetails: Omit<OrderDetail, 'id'>[]): Promise<OrderDetail[]>;
}
