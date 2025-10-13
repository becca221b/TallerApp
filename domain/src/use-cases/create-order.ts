import { OrderService } from "../services/order-service"; 
import { Order } from "../entities/Order";

export class CreateOrder {
    // Implementation of CreateOrder use case
    constructor(private readonly OrderService: OrderService) {}

    async saveOrder(order: Order): Promise<Order> {
        return await this.OrderService.saveOrder(order);
    }
}