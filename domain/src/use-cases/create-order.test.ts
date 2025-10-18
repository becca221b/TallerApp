import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service.js";
import { mockGarmentService } from "../mocks/mock-garment-service.js";
import { CreateOrder, CreateOrderDetailParams, CreateOrderParams } from "./create-order.js";
import { Order, OrderStatus } from "../entities/Order.js";
import { OrderDetail, orderSize } from "../entities/OrderDetail.js";
import { Garment, GarmentType } from "../entities/Garment.js";


describe('CreateOrder Use Case', () => {
    let createOrderUseCase: CreateOrder;
    let mockOrderService: ReturnType<typeof createMockOrderService>;
    let garmentServiceMock: ReturnType<typeof mockGarmentService>;

    beforeEach(() => {
        mockOrderService = createMockOrderService();
        garmentServiceMock = mockGarmentService();
        createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);
        vi.clearAllMocks();
    });

    describe('createOrderDetail', () => {
        it('should create OrderDetail independently', async () => {
            const testGarments = [{
                id: 'garment-123',
                name: 'shirt' as GarmentType,
                color: 'blue',
                price: 75,
                imageUrl: 'test.jpg',
                neck: 'round',
                cuff: 'standard',
                flap: 'standard',
                zipper: 'none',
                pocket: 'single',
                waist: 'standard'
            }];
            garmentServiceMock = mockGarmentService(testGarments);
            createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);
            
            const params: CreateOrderDetailParams = {
                garmentId: 'garment-123',
                quantity: 2,
                size: 'M',
                sex: 'F',
                subtotal: 0 // This will be calculated by the service
            };

            const orderDetail = await createOrderUseCase.createOrderDetail(params);

            expect(orderDetail.garmentId).toBe('garment-123');
            expect(orderDetail.quantity).toBe(2);
            expect(orderDetail.size).toBe('M');
            expect(orderDetail.sex).toBe('F');
            expect(orderDetail.subtotal).toBe(150); // 75 * 2
            expect(orderDetail.id).toBeDefined();
            expect(orderDetail.orderId).toBeUndefined(); // Should not be set yet
            expect(garmentServiceMock.findGarmentPriceById).toHaveBeenCalledWith('garment-123');
        });

        it('should validate OrderDetail parameters', async () => {
            const invalidParams: CreateOrderDetailParams = {
                garmentId: '',
                quantity: 0,
                size: 'M',
                sex: 'F',
                subtotal: 0
            };

            await expect(createOrderUseCase.createOrderDetail(invalidParams))
                .rejects.toThrow('Garment not found');
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

        it('should create Order with pending status by default', () => {
            const params: CreateOrderParams = {
                customerId: 'customer-123',
                employeeId: 'employee-456',
                deliveryDate: new Date('2025-12-01'),
                status: undefined
            };

            const order = createOrderUseCase.createOrder(params);
            expect(order.status).toBe(OrderStatus.Pending);
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

        it('should accumulate totalPrice when adding multiple garments', () => {
            const garmentDetail1: OrderDetail = {
                id: '1',
                quantity: 2,
                garmentId: '1',
                size: 'M' as orderSize,
                sex: 'M',
                subtotal: 200
            }
            const garmentDetail2: OrderDetail = {
                id: '2',
                quantity: 1,
                garmentId: '2',
                size: 'L' as orderSize,
                sex: 'F',
                subtotal: 150
            }

            let updatedOrder = createOrderUseCase.addGarmentToOrder(baseOrder, garmentDetail1);
            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garmentDetail2);
            expect(updatedOrder.totalPrice).toBe(350);
        });
    });

    describe('createCompleteOrder', () => {
        it('should follow the new workflow: create OrderDetails first, then Order, then add and save', async () => {
            // Setup test garments
            const testGarments = [
                {
                    id: 'shirt-001',
                    name: 'shirt' as GarmentType,
                    color: 'blue',
                    price: 100,
                    imageUrl: 'test1.jpg',
                    neck: 'round',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'none',
                    pocket: 'single',
                    waist: 'standard'
                },
                {
                    id: 'pants-001',
                    name: 'jacket' as GarmentType,
                    color: 'black',
                    price: 150,
                    imageUrl: 'test2.jpg',
                    neck: 'round',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'full',
                    pocket: 'double',
                    waist: 'standard'
                }
            ];
            garmentServiceMock = mockGarmentService(testGarments);
            createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);

            // Step 1: Create OrderDetails first
            const garment1 = await createOrderUseCase.createOrderDetail({
                garmentId: 'shirt-001',
                quantity: 2,
                size: 'M',
                sex: 'M',
                subtotal: 0
            });

            const garment2 = await createOrderUseCase.createOrderDetail({
                garmentId: 'pants-001',
                quantity: 1,
                size: 'L',
                sex: 'F',
                subtotal: 0
            });

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
            expect(savedOrder.orderDetails[0].subtotal).toBe(200); // 100 * 2
            expect(savedOrder.orderDetails[1].subtotal).toBe(150); // 150 * 1
            expect(savedOrder.totalPrice).toBe(350);
            expect(garmentServiceMock.findGarmentPriceById).toHaveBeenCalledTimes(2);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(savedOrder);
        });

        it('should handle supervisor workflow with new step-by-step approach', async () => {
            // Setup test garments
            const testGarments = [
                {
                    id: 'garment-shirt',
                    name: 'shirt' as GarmentType,
                    color: 'blue',
                    price: 100,
                    imageUrl: 'test1.jpg',
                    neck: 'round',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'none',
                    pocket: 'single',
                    waist: 'standard'
                },
                {
                    id: 'garment-pants',
                    name: 'jacket' as GarmentType,
                    color: 'black',
                    price: 200,
                    imageUrl: 'test2.jpg',
                    neck: 'round',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'full',
                    pocket: 'double',
                    waist: 'standard'
                }
            ];
            garmentServiceMock = mockGarmentService(testGarments);
            createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);

            // Step 1: Supervisor creates OrderDetails first (garment specifications)
            const shirtDetail = await createOrderUseCase.createOrderDetail({
                garmentId: 'garment-shirt',
                quantity: 3,
                size: 'M',
                sex: 'M',
                subtotal: 0
            });

            const pantsDetail = await createOrderUseCase.createOrderDetail({
                garmentId: 'garment-pants',
                quantity: 2,
                size: 'L',
                sex: 'F',
                subtotal: 0
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
            expect(finalOrder.orderDetails[0].subtotal).toBe(300); // 100 * 3
            expect(finalOrder.orderDetails[1].subtotal).toBe(400); // 200 * 2
            expect(finalOrder.totalPrice).toBe(700);
            expect(garmentServiceMock.findGarmentPriceById).toHaveBeenCalledTimes(2);
            expect(mockOrderService.saveOrder).toHaveBeenCalledTimes(1);
        });

        it('should handle edge case: order with maximum garments', async () => {
            // Setup test garments
            const testGarments = Array.from({ length: 10 }, (_, i) => ({
                id: `garment-${i + 1}`,
                name: 'shirt' as GarmentType,
                color: 'blue',
                price: (i + 1) * 50,
                imageUrl: `test${i + 1}.jpg`,
                neck: 'round',
                cuff: 'standard',
                flap: 'standard',
                zipper: 'none',
                pocket: 'single',
                waist: 'standard'
            }));
            
            garmentServiceMock = mockGarmentService(testGarments);
            createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);

            const order = createOrderUseCase.createOrder({
                customerId: '1',
                employeeId: '1',
                deliveryDate: new Date('2025-11-01')
            });

            // Create and add multiple garments
            let updatedOrder = order;
            for (let i = 1; i <= 10; i++) {
                const garmentDetail = await createOrderUseCase.createOrderDetail({
                    garmentId: `garment-${i}`,
                    quantity: i,
                    size: ['S', 'M', 'L', 'XL'][i % 4] as orderSize,
                    sex: i % 2 === 0 ? 'F' : 'M',
                    subtotal: 0
                });
                updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garmentDetail);
            }

            expect(updatedOrder.orderDetails).toHaveLength(10);
            expect(updatedOrder.orderDetails[9].quantity).toBe(10);
            expect(updatedOrder.orderDetails[9].subtotal).toBe(5000); // 500 * 10
            expect(updatedOrder.totalPrice).toBe(19250); // Sum of all subtotals
            expect(garmentServiceMock.findGarmentPriceById).toHaveBeenCalledTimes(10);
        });

        it('should handle different garment sizes and sexes', async () => {
            // Setup test garments with different types
            const testGarments = [
                {
                    id: 'shirt-s-m',
                    name: 'shirt' as GarmentType,
                    color: 'blue',
                    price: 100,
                    imageUrl: 'test1.jpg',
                    neck: 'round',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'none',
                    pocket: 'single',
                    waist: 'standard'
                },
                {
                    id: 'shirt-l-f',
                    name: 'shirt' as GarmentType,
                    color: 'pink',
                    price: 120,
                    imageUrl: 'test2.jpg',
                    neck: 'v-neck',
                    cuff: 'standard',
                    flap: 'standard',
                    zipper: 'none',
                    pocket: 'none',
                    waist: 'fitted'
                },
                {
                    id: 'jacket-xl-m',
                    name: 'jacket' as GarmentType,
                    color: 'black',
                    price: 200,
                    imageUrl: 'test3.jpg',
                    neck: 'high',
                    cuff: 'elastic',
                    flap: 'standard',
                    zipper: 'full',
                    pocket: 'double',
                    waist: 'standard'
                }
            ];
            
            garmentServiceMock = mockGarmentService(testGarments);
            createOrderUseCase = new CreateOrder(mockOrderService, garmentServiceMock);

            // Create order details with different sizes and sexes
            const garment1 = await createOrderUseCase.createOrderDetail({
                garmentId: 'shirt-s-m',
                quantity: 2,
                size: 'S',
                sex: 'M',
                subtotal: 0
            });

            const garment2 = await createOrderUseCase.createOrderDetail({
                garmentId: 'shirt-l-f',
                quantity: 1,
                size: 'L',
                sex: 'F',
                subtotal: 0
            });

            const garment3 = await createOrderUseCase.createOrderDetail({
                garmentId: 'jacket-xl-m',
                quantity: 1,
                size: 'XL',
                sex: 'M',
                subtotal: 0
            });

            // Create and update order
            let updatedOrder = createOrderUseCase.createOrder({
                customerId: '1',
                employeeId: '1',
                deliveryDate: new Date('2025-11-01')
            });

            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garment1);
            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garment2);
            updatedOrder = createOrderUseCase.addGarmentToOrder(updatedOrder, garment3);

            // Verify all garments with different sizes and sexes
            expect(updatedOrder.orderDetails).toHaveLength(3);
            expect(updatedOrder.orderDetails[0].size).toBe('S');
            expect(updatedOrder.orderDetails[0].sex).toBe('M');
            expect(updatedOrder.orderDetails[0].subtotal).toBe(200); // 100 * 2

            expect(updatedOrder.orderDetails[1].size).toBe('L');
            expect(updatedOrder.orderDetails[1].sex).toBe('F');
            expect(updatedOrder.orderDetails[1].subtotal).toBe(120); // 120 * 1

            expect(updatedOrder.orderDetails[2].size).toBe('XL');
            expect(updatedOrder.orderDetails[2].sex).toBe('M');
            expect(updatedOrder.orderDetails[2].subtotal).toBe(200); // 200 * 1

            expect(updatedOrder.totalPrice).toBe(520); // 200 + 120 + 200
            expect(garmentServiceMock.findGarmentPriceById).toHaveBeenCalledTimes(3);

            // Test complete flow with mix of sizes and sexes
            const savedOrder = await createOrderUseCase.saveOrder(updatedOrder);
            expect(savedOrder.totalPrice).toBe(520);
            expect(savedOrder.orderDetails).toHaveLength(3);
        });
    });
});