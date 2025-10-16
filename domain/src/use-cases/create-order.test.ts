import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { CreateOrder, CreateOrderDetailParams, CreateOrderParams } from "./create-order";
import { Order, OrderStatus } from "../entities/Order";
import { OrderDetail, orderSize } from "../entities/OrderDetail";

describe('CreateOrder Use Case', () => {
    let createOrderUseCase: CreateOrder;
    let mockOrderService: ReturnType<typeof createMockOrderService>;

    beforeEach(() => {
        mockOrderService = createMockOrderService();
        createOrderUseCase = new CreateOrder(mockOrderService);
        vi.clearAllMocks();
    });

    describe('createOrderDetail', () => {
        it('should create OrderDetail independently', () => {
            const params: CreateOrderDetailParams = {
                garmentId: 'garment-123',
                quantity: 2,
                size: 'M',
                sex: 'F',
                subtotal: 150
            };

            const orderDetail = createOrderUseCase.createOrderDetail(params);

            expect(orderDetail.garmentId).toBe('garment-123');
            expect(orderDetail.quantity).toBe(2);
            expect(orderDetail.size).toBe('M');
            expect(orderDetail.sex).toBe('F');
            expect(orderDetail.subtotal).toBe(150);
            expect(orderDetail.id).toBeDefined();
            expect(orderDetail.orderId).toBeUndefined(); // Should not be set yet
        });

        it('should validate OrderDetail parameters', () => {
            const invalidParams: CreateOrderDetailParams = {
                garmentId: '',
                quantity: 0,
                size: 'M',
                sex: 'F',
                subtotal: -10
            };

            expect(() => createOrderUseCase.createOrderDetail(invalidParams))
                .toThrow('Quantity must be greater than 0');
        });
    });

    describe('createOrder', () => {
        it('should create empty Order structure', () => {
            const params: CreateOrderParams = {
                customerId: 'customer-123',
                employeeId: 'employee-456',
                deliveryDate: new Date('2025-12-01')
            };

            const order = createOrderUseCase.createOrder(params);

            expect(order.customerId).toBe('customer-123');
            expect(order.employeeId).toBe('employee-456');
            expect(order.deliveryDate).toEqual(new Date('2025-12-01'));
            expect(order.status).toBe(OrderStatus.Pending);
            expect(order.orderDetails).toEqual([]);
            expect(order.id).toBeDefined();
            expect(order.orderDate).toBeInstanceOf(Date);
        });

        it('should create Order with custom status', () => {
            const params: CreateOrderParams = {
                customerId: 'customer-123',
                employeeId: 'employee-456',
                deliveryDate: new Date('2025-12-01'),
                status: OrderStatus.InProcess
            };

            const order = createOrderUseCase.createOrder(params);

            expect(order.status).toBe(OrderStatus.InProcess);
        });
    });

    describe('createCompleteOrder', () => {
        it('should follow the complete workflow: create OrderDetails first, then Order, then add and save', async () => {
            const orderParams: CreateOrderParams = {
                customerId: 'customer-123',
                employeeId: 'employee-456',
                deliveryDate: new Date('2025-12-01')
            };

            const garmentParams: CreateOrderDetailParams[] = [
                {
                    garmentId: 'shirt-001',
                    quantity: 2,
                    size: 'M',
                    sex: 'M',
                    subtotal: 200
                },
                {
                    garmentId: 'pants-001',
                    quantity: 1,
                    size: 'L',
                    sex: 'F',
                    subtotal: 150
                }
            ];

            const savedOrder = await createOrderUseCase.createCompleteOrder(orderParams, garmentParams);

            expect(savedOrder.customerId).toBe('customer-123');
            expect(savedOrder.employeeId).toBe('employee-456');
            expect(savedOrder.orderDetails).toHaveLength(2);
            expect(savedOrder.orderDetails[0].garmentId).toBe('shirt-001');
            expect(savedOrder.orderDetails[1].garmentId).toBe('pants-001');
            expect(savedOrder.orderDetails[0].orderId).toBe(savedOrder.id);
            expect(savedOrder.orderDetails[1].orderId).toBe(savedOrder.id);
            expect(mockOrderService.saveOrder).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveOrder', () => {
        it('should create an order successfully', async () => {
            const newOrder: Order = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };

            const savedOrder = await createOrderUseCase.saveOrder(newOrder);
            
            expect(savedOrder).toEqual(newOrder);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(newOrder);
            expect(mockOrderService.saveOrder).toHaveBeenCalledTimes(1);
        });

        it('should set order date to current date', async () => {
            const fixedDate = new Date('2024-01-01');
            vi.setSystemTime(fixedDate);
            
            const newOrder: Order = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date('2023-01-01'), // This will be overridden
                deliveryDate: new Date('2025-11-01')
            };

            const savedOrder = await createOrderUseCase.saveOrder(newOrder);
            
            expect(savedOrder.orderDate).toEqual(fixedDate);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(
                expect.objectContaining({ orderDate: fixedDate })
            );
        });

        it('should set default status to pending', async () => {
            const newOrder: Order = {
                id: '1',
                customerId: '1',
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };

            const savedOrder = await createOrderUseCase.saveOrder(newOrder);
            
            expect(savedOrder.status).toBe(OrderStatus.Pending);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(
                expect.objectContaining({ status: OrderStatus.Pending })
            );
        });

        

        it('should throw error if delivery date is before or equal to order date', async () => {
            const orderDate = new Date('2024-01-02');
            const deliveryDate = new Date('2024-01-01');
            
            const newOrder: Order = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate,
                deliveryDate
            };

            await expect(createOrderUseCase.saveOrder(newOrder))
                .rejects.toThrow('Delivery date must be after order date');
            
            expect(mockOrderService.saveOrder).not.toHaveBeenCalled();
        });

        it('should throw error if order status is invalid', async () => {
            const newOrder: Order = {
                id: '1',
                customerId: '1',
                status: 'invalid-status' as OrderStatus,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };

            await expect(createOrderUseCase.saveOrder(newOrder))
                .rejects.toThrow('Order status must be pending, in process, or completed');
            
            expect(mockOrderService.saveOrder).not.toHaveBeenCalled();
        });

    });

    describe('addGarmentToOrder', () => {
        let baseOrder: Order;

        beforeEach(() => {
            baseOrder = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };
        });

        it('should add garment to order details successfully', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 100
            };

            const updatedOrder = createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail);
            
            expect(updatedOrder.orderDetails).toHaveLength(1);
            expect(updatedOrder.orderDetails[0]).toEqual(
                expect.objectContaining({
                    ...garmentDetail,
                    orderId: baseOrder.id
                })
            );
        });

        it('should set orderId when adding garment to order', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '1',
                size: 'L' as orderSize,
                sex: 'F',
                subtotal: 150
            };

            const updatedOrder = createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail);
            
            expect(updatedOrder.orderDetails[0].orderId).toBe(baseOrder.id);
        });

        

        it('should add multiple garments to order', () => {
            const garmentDetail1: OrderDetail = {
                id: '1',
                quantity: 2,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 200
            };

            const garmentDetail2: OrderDetail = {
                id: '2',
                quantity: 1,
                garmentId: '2',
                size: 'L' as orderSize,
                sex: 'F',
                subtotal: 150
            };

            const updatedOrder1 = createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail1);
            const updatedOrder2 = createOrderUseCase.addGarmentToOrder(updatedOrder1, garmentDetail2);
            
            expect(updatedOrder2.orderDetails).toHaveLength(2);
            expect(updatedOrder2.orderDetails[0].garmentId).toBe('1');
            expect(updatedOrder2.orderDetails[1].garmentId).toBe('2');
        });

        it('should throw error if quantity is less than or equal to 0', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 0,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 100
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Quantity must be greater than 0');
        });

        it('should throw error if quantity is negative', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: -1,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 100
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Quantity must be greater than 0');
        });

        it('should throw error if garmentId is missing', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '' as any,
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 100
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Garment ID is required');
        });

        it('should throw error if size is missing', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '1',
                size: '' as any,
                sex: 'M',
                subtotal: 100
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Size is required');
        });

        it('should throw error if sex is missing', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: '' as any,
                subtotal: 100
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Sex is required');
        });

        it('should throw error if subtotal is negative', () => {
            const garmentDetail: OrderDetail = {
                id: '1',
                quantity: 1,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: -50
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail))
                .toThrow('Subtotal must be greater than or equal to 0');
        });

        

        it('should validate all garment detail fields', () => {
            const invalidGarmentDetail: OrderDetail = {
                id: '1',
                quantity: 0, // Invalid quantity
                garmentId: '', // Invalid garmentId
                size: '' as any, // Invalid size
                sex: '' as any, // Invalid sex
                subtotal: -10 // Invalid subtotal
            };

            expect(() => createOrderUseCase.addGarmentToOrder(baseOrder, invalidGarmentDetail))
                .toThrow('Quantity must be greater than 0');
        });
    });

    describe('Integration scenarios', () => {
        it('should follow the new workflow: create OrderDetails first, then Order, then add and save', async () => {
            // Step 1: Create OrderDetails first
            const garment1Params: CreateOrderDetailParams = {
                garmentId: 'shirt-001',
                quantity: 2,
                size: 'M',
                sex: 'M',
                subtotal: 200
            };

            const garment2Params: CreateOrderDetailParams = {
                garmentId: 'pants-001',
                quantity: 1,
                size: 'L',
                sex: 'F',
                subtotal: 150
            };

            const garment1 = createOrderUseCase.createOrderDetail(garment1Params);
            const garment2 = createOrderUseCase.createOrderDetail(garment2Params);

            // Step 2: Create empty Order
            const orderParams: CreateOrderParams = {
                customerId: '1',
                employeeId: '1',
                deliveryDate: new Date('2025-11-01')
            };
            const order = createOrderUseCase.createOrder(orderParams);

            // Step 3: Add garments to Order
            let updatedOrder = createOrderUseCase.addGarmentToOrder(order, garment1);
            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garment2);

            // Step 4: Save the complete Order
            const savedOrder = await createOrderUseCase.saveOrder(updatedOrder);

            expect(savedOrder.orderDetails).toHaveLength(2);
            expect(savedOrder.orderDetails[0].orderId).toBe(savedOrder.id);
            expect(savedOrder.orderDetails[1].orderId).toBe(savedOrder.id);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(savedOrder);
        });

        it('should handle supervisor workflow with new step-by-step approach', async () => {
            // Step 1: Supervisor creates OrderDetails first (garment specifications)
            const shirtDetail = createOrderUseCase.createOrderDetail({
                garmentId: 'garment-shirt',
                quantity: 3,
                size: 'M',
                sex: 'M',
                subtotal: 300
            });

            const pantsDetail = createOrderUseCase.createOrderDetail({
                garmentId: 'garment-pants',
                quantity: 2,
                size: 'L',
                sex: 'F',
                subtotal: 400
            });

            // Step 2: Create empty Order structure
            const order = createOrderUseCase.createOrder({
                customerId: 'customer-456',
                employeeId: 'employee-789',
                deliveryDate: new Date('2025-12-01')
            });

            // Step 3: Add garments to the order
            let updatedOrder = createOrderUseCase.addGarmentToOrder(order, shirtDetail);
            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, pantsDetail);

            // Step 4: Save the complete order
            const finalOrder = await createOrderUseCase.saveOrder(updatedOrder);

            // Verify the complete order structure
            expect(finalOrder.customerId).toBe('customer-456');
            expect(finalOrder.employeeId).toBe('employee-789');
            expect(finalOrder.status).toBe(OrderStatus.Pending);
            expect(finalOrder.orderDetails).toHaveLength(2);
            expect(finalOrder.orderDetails[0].quantity).toBe(3);
            expect(finalOrder.orderDetails[1].quantity).toBe(2);
            expect(mockOrderService.saveOrder).toHaveBeenCalledTimes(1);
        });

        it('should handle edge case: order with maximum garments', () => {
            const order: Order = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };

            // Add multiple garments to test array handling
            const garments: OrderDetail[] = [];
            for (let i = 1; i <= 10; i++) {
                garments.push({
                    id: `detail-${i}`,
                    quantity: i,
                    garmentId: `garment-${i}`,
                    size: ['S', 'M', 'L', 'XL'][i % 4] as orderSize,
                    sex: i % 2 === 0 ? 'F' : 'M',
                    subtotal: i * 50
                });
            }

            let updatedOrder = order;
            garments.forEach(garment => {
                updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garment);
            });

            expect(updatedOrder.orderDetails).toHaveLength(10);
            expect(updatedOrder.orderDetails[9].quantity).toBe(10);
            expect(updatedOrder.orderDetails[9].subtotal).toBe(500);
        });

        it('should handle different garment sizes and sexes', () => {
            const order: Order = {
                id: '1',
                customerId: '1',
                status: OrderStatus.Pending,
                employeeId: '1',
                orderDetails: [],
                orderDate: new Date(),
                deliveryDate: new Date('2025-11-01')
            };

            const testCases = [
                { size: 'S' as orderSize, sex: 'F' as const, quantity: 1, subtotal: 50 },
                { size: 'M' as orderSize, sex: 'M' as const, quantity: 2, subtotal: 100 },
                { size: 'L' as orderSize, sex: 'F' as const, quantity: 1, subtotal: 75 },
                { size: 'XL' as orderSize, sex: 'M' as const, quantity: 3, subtotal: 225 }
            ];

            testCases.forEach((testCase, index) => {
                const garmentDetail: OrderDetail = {
                    id: `detail-${index}`,
                    quantity: testCase.quantity,
                    garmentId: `garment-${index}`,
                    size: testCase.size,
                    sex: testCase.sex,
                    subtotal: testCase.subtotal
                };

                const updatedOrder = createOrderUseCase.addGarmentToOrder(order, garmentDetail);
                expect(updatedOrder.orderDetails[index]).toEqual(
                    expect.objectContaining({
                        size: testCase.size,
                        sex: testCase.sex,
                        quantity: testCase.quantity,
                        subtotal: testCase.subtotal
                    })
                );
            });
        });
    });
});