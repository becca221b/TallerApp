import { OrderService } from "../services/order-service"; 
import { Order } from "../entities/Order";

export class CreateOrder {
    // Implementation of CreateOrder use case
    constructor(private readonly orderService: OrderService) {}

    async saveOrder(order: Order): Promise<Order> {

        order.status = order.status ?? 'pending';
        this.validateOrder(order);
        return await this.orderService.saveOrder(order);
    }

    private validateOrder(order: Order): void {
        // Validate presence of order details first (business rule: an order must contain at least one detail)
        if (order.orderDetails.length === 0) {
            throw new Error('Order must have at least one order detail');
        }

        // Validate delivery date relative to order date next
        if (order.deliveryDate <= order.orderDate) {
            throw new Error('Delivery date must be after order date');
        }

        // Finally validate status value
        const validStatuses = ['pending', 'in process', 'completed'];
        if (!validStatuses.includes(order.status)) {
            throw new Error('Order status must be pending, in process, or completed');
        }
    }
}