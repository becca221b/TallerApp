import { OrderService } from '@/domain/services/order-service';
import { Order } from '@/domain/entities/Order';
import { OrderModel } from 'src/models/OrderModel';

export class OrderRepository implements OrderService {
    async saveOrder(order: Order): Promise<Order> {
        const newOrder = new OrderModel(order);
        const savedOrder = await newOrder.save();
        return savedOrder.toObject();
    }
    async findOrderById(id: string): Promise<Order | null> {
        const order = await OrderModel.findById(id).exec();
        return order ? order.toObject() : null;
    }

    async findOrdersByEmployeeId(employeeId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ employeeId }).exec();
        return orders.map(order => order.toObject());
    }
    async findOrdersByCustomerId(customerId: string): Promise<Order[]> {
        const orders = await OrderModel.find({ customerId }).exec();
        return orders.map(order => order.toObject());
    }
    async updateOrder(id: string, order: Partial<Order>): Promise<Order | null> {
        const updated = await OrderModel.findByIdAndUpdate(id, order, { new: true }).exec();
        return updated ? updated.toObject() : null;
    }
    async deleteOrder(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async findAllOrders(): Promise<Order[]> {
        const orders = await OrderModel.find().exec();
        return orders.map(order => order.toObject());
    }
}
