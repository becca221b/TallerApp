import { OrderService } from "../services/order-service"; 
import { Order, OrderStatus } from "../entities/Order";
import { OrderDetail } from "../entities/OrderDetail";

export class CreateOrder {
    // Implementation of CreateOrder use case
    constructor(
        private readonly orderService: OrderService,
    ) {}

    async saveOrder(order: Order): Promise<Order> {
        order.orderDate = new Date(); // Always set to current date
        order.status = order.status ?? OrderStatus.Pending; // Using enum
        this.validateOrder(order);
        return await this.orderService.saveOrder(order);
    }

    addGarmentToOrder(order: Order, garmentDetail: OrderDetail): Order {
        if (!order.orderDetails) {
            order.orderDetails = [];
        }
        
        garmentDetail.orderId = order.id;

        // Validate garment detail before adding
        this.validateGarmentDetail(garmentDetail);
        
        order.orderDetails.push(garmentDetail);
        return order;
    }

    private validateGarmentDetail(garmentDetail: OrderDetail): void {
        if (!garmentDetail.quantity || garmentDetail.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        
        if (!garmentDetail.garmentId) {
            throw new Error('Garment ID is required');
        }

        if (!garmentDetail.size) {
            throw new Error('Size is required');
        }

        if (!garmentDetail.sex) {
            throw new Error('Sex is required');
        }

        if (!garmentDetail.subtotal || garmentDetail.subtotal < 0) {
            throw new Error('Subtotal must be greater than or equal to 0');
        }
    }

    private validateOrder(order: Order): void {
        

        // Validate delivery date relative to order date next
        if (order.deliveryDate <= order.orderDate) {
            throw new Error('Delivery date must be after order date');
        }

        
        // Finally validate status value
        const validStatuses = [OrderStatus.Pending, OrderStatus.InProcess, OrderStatus.Completed];
        if (!validStatuses.includes(order.status!)) {
            throw new Error('Order status must be pending, in process, or completed');
        }
    }
}