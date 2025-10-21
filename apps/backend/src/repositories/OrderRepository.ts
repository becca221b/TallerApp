import { OrderService } from "@/domain/services/order-service";
import { Order } from "@/domain/entities/Order";
import { OrderModel } from "../models/OrderModel";

export class OrderRepository implements OrderService {
    
    async saveOrder(order: Order): Promise<Order> {
        const newOrder = await OrderModel.create(order);
        return newOrder;
    }

    async findOrderById(id: string): Promise<Order | null> {
        const order = await OrderModel.findById(id);
        return order;
    }

    async findOrdersByEmployeeId(employeeId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ employeeId });
        return orders;
    }

    async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ customerId });
        return orders;
    }

    async findAllOrders(): Promise<Order[]> {
        const orders = await OrderModel.find();
        return orders;
    }

    async updateOrder(id: string, order: Partial<Order>): Promise<Order | null> {
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, order);
        return updatedOrder;
    }

    async deleteOrder(id: string): Promise<boolean> {
        await OrderModel.findByIdAndDelete(id);
        return true;
    }
}