import { Order } from "../entities/Order";

export interface OrderService {
    saveOrder(order: Order): Promise<Order>;
    //findOrderById(id: string): Promise<Order | null>;
    //findOrdersByCustomerId(customerId: string): Promise<Order[]>;
    //updateOrder(id: string, order: Partial<Order>): Promise<Order | null>;
    //deleteOrder(id: string): Promise<boolean>;
    //findAllOrders(): Promise<Order[]>;
}