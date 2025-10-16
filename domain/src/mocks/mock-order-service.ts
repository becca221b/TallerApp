import {vi} from 'vitest';
import type { OrderService } from '../services/order-service';
import type { Order } from '../entities/Order';

export const createMockOrderService = (
    orders: Order[] = []
): OrderService => {
    return {
        saveOrder: vi.fn().mockImplementation(async (order: Order) => {
            orders.push(order);
            return order;
        }),
        findOrderById: vi.fn().mockImplementation(async (id: string) => {
            return orders.find(order => order.id === id) || null;
        }),
        findOrdersByEmployeeId: vi.fn().mockImplementation(async (employeeId: string) => {
            return orders.filter(order => order.employeeId === employeeId);
        }),
        findOrdersByCustomerId: vi.fn().mockImplementation(async (customerId: string) => {
            return orders.filter(order => order.customerId === customerId);
        }),
        updateOrder: vi.fn().mockImplementation(async (id: string, orderUpdate: Partial<Order>) => {
            const orderIndex = orders.findIndex(order => order.id === id);
            if (orderIndex !== -1) {
                orders[orderIndex] = { ...orders[orderIndex], ...orderUpdate };
                return orders[orderIndex];
            }
            return null;
        }),
        deleteOrder: vi.fn().mockImplementation(async (id: string) => {
            const orderIndex = orders.findIndex(order => order.id === id);
            if (orderIndex !== -1) {
                orders.splice(orderIndex, 1);
                return true;
            }
            return false;
        }),
        findAllOrders: vi.fn().mockImplementation(async () => {
            return [...orders];
        })
    };
}