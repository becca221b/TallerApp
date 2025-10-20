import { Request, Response } from 'express';
import { CreateOrder, CreateOrderParams, CreateOrderDetailParams } from '@/domain/use-cases/create-order';
import { AssignOrder, AssignOrderParams } from '@/domain/use-cases/assign-order';
import { OrderService } from '@/domain/services/order-service';
import { GarmentService } from '@/domain/services/garment-service';
import { EmployeeService } from '@/domain/services/employee-service';
import { OrderStatus } from '@/domain/entities/Order';

export class OrderController {
    constructor(
        private readonly createOrderUseCase: CreateOrder,
        private readonly assignOrderUseCase: AssignOrder,
        private readonly orderService: OrderService
    ) {}

    async createOrder(req: Request, res: Response) {
        try {
            const { customerId, employeeId, deliveryDate, garments } = req.body;

            // Validate required fields
            if (!customerId || !employeeId || !deliveryDate || !garments || !Array.isArray(garments)) {
                return res.status(400).json({ 
                    error: 'Missing required fields. Required: customerId, employeeId, deliveryDate, garments (array)' 
                });
            }

            // Validate garments array
            if (garments.length === 0) {
                return res.status(400).json({ 
                    error: 'Order must contain at least one garment' 
                });
            }

            // Prepare order parameters
            const orderParams: CreateOrderParams = {
                customerId,
                employeeId,
                deliveryDate: new Date(deliveryDate),
                status: OrderStatus.Pending
            };

            // Prepare garment parameters
            const garmentParams: CreateOrderDetailParams[] = garments.map(garment => ({
                garmentId: garment.garmentId,
                quantity: garment.quantity,
                size: garment.size,
                sex: garment.sex,
                subtotal: 0 // Will be calculated by the use case
            }));

            // Create the complete order using the use case
            const order = await this.createOrderUseCase.createCompleteOrder(
                orderParams,
                garmentParams
            );

            res.status(201).json(order);
        } catch (error) {
            console.error('Error creating order:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error while creating order' });
            }
        }
    }

    async assignOrder(req: Request, res: Response) {
        try {
            const { orderId, employeeId, assignedBySupervisorId } = req.body;

            // Validate required fields
            if (!orderId || !employeeId || !assignedBySupervisorId) {
                return res.status(400).json({ 
                    error: 'Missing required fields. Required: orderId, employeeId, assignedBySupervisorId' 
                });
            }

            // Prepare assignment parameters
            const assignParams: AssignOrderParams = {
                orderId,
                employeeId,
                assignedBySupervisorId
            };

            // Assign the order using the use case
            const assignedOrder = await this.assignOrderUseCase.assignOrder(assignParams);

            res.status(200).json(assignedOrder);
        } catch (error) {
            console.error('Error assigning order:', error);
            if (error instanceof Error) {
                // Handle specific error cases
                if (error.message.includes('not found')) {
                    return res.status(404).json({ error: error.message });
                }
                if (error.message.includes('not active') || 
                    error.message.includes('not a supervisor') ||
                    error.message.includes('cannot be assigned')) {
                    return res.status(403).json({ error: error.message });
                }
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error while assigning order' });
            }
        }
    }

    async getOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id;
            if (!orderId) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            const order = await this.orderService.findOrderById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            res.status(200).json(order);
        } catch (error) {
            console.error('Error getting order:', error);
            res.status(500).json({ error: 'Internal server error while fetching order' });
        }
    }

    async getOrdersByCustomer(req: Request, res: Response) {
        try {
            const customerId = req.params.customerId;
            if (!customerId) {
                return res.status(400).json({ error: 'Customer ID is required' });
            }

            const orders = await this.orderService.findOrdersByCustomerId(customerId);
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error getting customer orders:', error);
            res.status(500).json({ error: 'Internal server error while fetching customer orders' });
        }
    }

    async getOrdersByEmployee(req: Request, res: Response) {
        try {
            const employeeId = req.params.employeeId;
            if (!employeeId) {
                return res.status(400).json({ error: 'Employee ID is required' });
            }

            const orders = await this.orderService.findOrdersByEmployeeId(employeeId);
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error getting employee orders:', error);
            res.status(500).json({ error: 'Internal server error while fetching employee orders' });
        }
    }
}

// Factory function to create the controller with all dependencies
export const createOrderController = (
    orderService: OrderService,
    garmentService: GarmentService,
    employeeService: EmployeeService
) => {
    const createOrderUseCase = new CreateOrder(orderService, garmentService);
    const assignOrderUseCase = new AssignOrder(orderService, employeeService);
    return new OrderController(createOrderUseCase, assignOrderUseCase, orderService);
};
