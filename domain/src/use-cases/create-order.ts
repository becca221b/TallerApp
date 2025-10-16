import { OrderService } from "../services/order-service"; 
import { Order, OrderStatus } from "../entities/Order";
import { OrderDetail, orderSize } from "../entities/OrderDetail";

export interface CreateOrderDetailParams {
    garmentId: string;
    quantity: number;
    size: orderSize;
    sex: 'F' | 'M';
    subtotal: number;
}

export interface CreateOrderParams {
    customerId: string;
    employeeId: string;
    deliveryDate: Date;
    status?: OrderStatus;
}

export class CreateOrder {
    // Implementation of CreateOrder use case
    constructor(
        private readonly orderService: OrderService,
    ) {}

    /**
     * Step 1: Create OrderDetail independently
     */
    createOrderDetail(params: CreateOrderDetailParams): OrderDetail {
        const orderDetail: OrderDetail = {
            id: this.generateId(),
            garmentId: params.garmentId,
            quantity: params.quantity,
            size: params.size,
            sex: params.sex,
            subtotal: params.subtotal
        };

        this.validateGarmentDetail(orderDetail);
        return orderDetail;
    }

    /**
     * Step 2: Create empty Order structure
     */
    createOrder(params: CreateOrderParams): Order {
        const order: Order = {
            id: this.generateId(),
            customerId: params.customerId,
            employeeId: params.employeeId,
            status: params.status ?? OrderStatus.Pending,
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: params.deliveryDate
        };

        return order;
    }

    /**
     * Step 3: Add OrderDetail to Order
     */
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

    /**
     * Step 4: Save the complete Order
     */
    async saveOrder(order: Order): Promise<Order> {
        order.orderDate = new Date(); // Always set to current date
        order.status = order.status ?? OrderStatus.Pending; // Using enum
        this.validateOrder(order);
        return await this.orderService.saveOrder(order);
    }

    /**
     * Complete workflow: Create OrderDetail, create Order, add garment, and save
     */
    async createCompleteOrder(
        orderParams: CreateOrderParams,
        garmentParams: CreateOrderDetailParams[]
    ): Promise<Order> {
        // Step 1: Create OrderDetails first
        const orderDetails = garmentParams.map(params => this.createOrderDetail(params));
        
        // Step 2: Create empty Order
        const order = this.createOrder(orderParams);
        
        // Step 3: Add all garments to Order
        orderDetails.forEach(orderDetail => {
            this.addGarmentToOrder(order, orderDetail);
        });
        
        // Step 4: Save the complete Order
        return await this.saveOrder(order);
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
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