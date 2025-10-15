import { describe, it, expect } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { CreateOrder } from "./create-order";
import { Order, OrderStatus } from "../entities/Order";
import { OrderDetail, orderSize } from "../entities/OrderDetail";


describe('Create an order',()=>{
    it('should create an order', async()=>{
        const mockOrderService = createMockOrderService();

        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: OrderStatus.Pending,
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
           
        }

        const saveOrder = await mockOrderService.saveOrder(newOrder);
        expect(saveOrder).toEqual(newOrder);
        expect(mockOrderService.saveOrder).toHaveBeenCalledWith(newOrder);
    })
})
describe('Create an order',()=>{
    it('should set todays order date to current date', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: OrderStatus.Pending,
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date('2023-01-01'), // This will be overridden
            deliveryDate: new Date('2025-11-01')
        }
    });
    it('should set order status to pending', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }
        const savedOrder = await createOrderUseCase.saveOrder(newOrder);
        expect(savedOrder.status).toBe(OrderStatus.Pending);
        expect(mockOrderService.saveOrder).toHaveBeenCalledWith(savedOrder);
    });
});

describe('Validation errors on create order',()=>{
    it('should throw error if orderStatus is not pending, in process, or completed', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);

        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: 'shipped' as OrderStatus, // Invalid status
            employeeId: '1',
            orderDetails: [{ id: '1', orderId: '1', quantity: 1, garmentId: '1', size: 'M', sex: 'M', subtotal: 100 }],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }

        const savedOrder = createOrderUseCase.saveOrder(newOrder);
        await expect(savedOrder).rejects.toThrow('Order status must be pending, in process, or completed');
        expect(mockOrderService.saveOrder).not.toHaveBeenCalledWith(newOrder);
    });

    it('should throw error if delivery date is before order date', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new (await import('./create-order')).CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: OrderStatus.Pending,
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

describe('Add garment to order details',()=>{
    it('should add garment to order details', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new CreateOrder(mockOrderService);
                        
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            status: OrderStatus.Pending,
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }

        const garmentDetail = {
            id: '1',
            orderId: '1',
            quantity: 1,
            garmentId: '1',
            size: 'M' as orderSize,
            sex: 'M' as 'M',
            subtotal: 100
        };

        const updatedOrder = createOrderUseCase.addGarmentToOrder(newOrder, garmentDetail);
        expect(updatedOrder.orderDetails.length).toBe(1);
        expect(updatedOrder.orderDetails[0]).toEqual(garmentDetail);
    });
});

describe('Validation errors on add garment to order details',()=>{
    it('should throw error if quantity is less than or equal to 0', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }
        const garmentDetail = {
            id: '1',
            orderId: '1',
            quantity: 0, // Invalid quantity
            garmentId: '1',
            size: 'M' as orderSize
        },
        updatedOrder = () => createOrderUseCase.addGarmentToOrder(newOrder, garmentDetail as any);
        expect(updatedOrder).toThrow('Quantity must be greater than 0');
    });

    it('orderId at orderDetail should be set when adding garment to order', async()=>{
        const mockOrderService = createMockOrderService();
        const createOrderUseCase = new CreateOrder(mockOrderService);
        const newOrder: Order = {
            id: '1',
            customerId: '1',
            employeeId: '1',
            orderDetails: [],
            orderDate: new Date(),
            deliveryDate: new Date('2025-11-01')
        }
        const garmentDetail: OrderDetail = {
            id: '1',
            quantity: 1,
            garmentId: '1',
            size: 'M' as orderSize,
            sex: 'M' as 'M',
            subtotal: 100
        };
        const updatedOrder = createOrderUseCase.addGarmentToOrder(newOrder, garmentDetail);
        expect(updatedOrder.orderDetails[0].orderId).toBe(newOrder.id);
    });
});