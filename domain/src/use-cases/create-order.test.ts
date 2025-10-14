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
            status: 'pending',
            employeeId: '1',
            orderDetails: [{ id: '1', orderId: '1', quantity: 1, garmentId: '1', size: 'M', sex: 'M', subtotal: 100 }],
            orderDate: new Date(),
            deliveryDate: new Date()
           
        }

        const saveOrder = await mockOrderService.saveOrder(newOrder);
        expect(saveOrder).toEqual(newOrder);
        expect(mockOrderService.saveOrder).toHaveBeenCalledWith(newOrder);
    })
})

describe('Validation errors on create order',()=>{
    it('should throw error if orderStatus is not pending, in process, or completed', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);

        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'shipped' as any, // Invalid status
            employeeId: '1',
            orderDetails: [{ id: '1', orderId: '1', quantity: 1, garmentId: '1', size: 'M', sex: 'M', subtotal: 100 }],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }

        const savedOrder = createOrderUseCase.saveOrder(newOrder);
        await expect(savedOrder).rejects.toThrow('Order status must be pending, in process, or completed');
        expect(mockOrderService.saveOrder).not.toHaveBeenCalledWith(newOrder);
    });
});

describe('Validation errors on create order',()=>{
    it('should throw error if order has no order details', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'pending',
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }
        const savedOrder = createOrderUseCase.saveOrder(newOrder);
        await expect(savedOrder).rejects.toThrow('Order must have at least one order detail');
        expect(mockOrderService.saveOrder).not.toHaveBeenCalledWith(newOrder);
    });
    it('should throw error if delivery date is before order date', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'pending',
            employeeId: '1',
            orderDetails: [{ id: '1', orderId: '1', quantity: 1, garmentId: '1', size: 'M', sex: 'M', subtotal: 100 }],
            orderDate: new Date('2023-01-02'),
            deliveryDate: new Date('2023-01-01')
        }
        const savedOrder = createOrderUseCase.saveOrder(newOrder);
        await expect(savedOrder).rejects.toThrow('Delivery date must be after order date');
        expect(mockOrderService.saveOrder).not.toHaveBeenCalledWith(newOrder);
    });
});