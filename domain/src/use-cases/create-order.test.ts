import { describe, it, expect } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { CreateOrder } from "./create-order";
import { Order } from "../entities/Order";


describe('Create an order',()=>{
    it('should create an order', async()=>{
        const mockOrderService = createMockOrderService();

        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'orderStatus',
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date()
           
        }

        const saveOrder = await mockOrderService.saveOrder(newOrder);
        expect(saveOrder).toEqual(newOrder);
        expect(mockOrderService.saveOrder).toHaveBeenCalledWith(newOrder);
    })
})

describe('Validarion errors on create order',()=>{
    it('should throw error if orderStatus is not pending, in process, or completed', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);

        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'shipped' as any, // Invalid status
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date()
        }

        const savedOrder = createOrderUseCase.saveOrder(newOrder);
        await expect(savedOrder).rejects.toThrow('Order status must be pending, in process, or completed');
        expect(mockOrderService.saveOrder).not.toHaveBeenCalledWith(newOrder);
    });
});