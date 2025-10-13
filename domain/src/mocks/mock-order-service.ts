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

    };
}