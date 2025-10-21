import { Request, Response } from 'express';
import { CreateOrderUseCase } from '@/domain/use-cases/CreateOrderUseCase';
import { AssignOrderUseCase } from '@/domain/use-cases/AssignOrderUseCase';
import { GetOrdersUseCase } from '@/domain/use-cases/GetOrdersUseCase';

export class OrderController {
    constructor(
        private readonly createOrderUseCase: CreateOrderUseCase,
        private readonly assignOrderUseCase: AssignOrderUseCase,
        private readonly getOrdersUseCase: GetOrdersUseCase
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

            // Verify employee exists
            const employee = await this.employeeRepository.findEmployeeById(employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            // Verify and calculate garment prices
            const garmentDetails = await Promise.all(garments.map(async (garment) => {
                const garmentInfo = await this.garmentRepository.findGarmentById(garment.garmentId);
                if (!garmentInfo) {
                    throw new Error(`Garment with id ${garment.garmentId} not found`);
                }
                return {
                    ...garment,
                    subtotal: garmentInfo.price * garment.quantity
                };
            }));

            // Create order
            const order = await this.orderRepository.saveOrder({
                customerId,
                employeeId,
                deliveryDate: new Date(deliveryDate),
                status: OrderStatus.Pending,
                orderDetails: garmentDetails,
                totalPrice: garmentDetails.reduce((sum, g) => sum + g.subtotal, 0)
            });

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

            // Verify order exists
            const order = await this.orderRepository.findOrderById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Verify employee exists and is active
            const employee = await this.employeeRepository.findEmployeeById(employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            if (!employee.isActive) {
                return res.status(403).json({ error: 'Employee is not active' });
            }

            // Verify supervisor exists and has proper role
            const supervisor = await this.employeeRepository.findEmployeeById(assignedBySupervisorId);
            if (!supervisor) {
                return res.status(404).json({ error: 'Supervisor not found' });
            }
            if (supervisor.employeeType !== 'Supervisor') {
                return res.status(403).json({ error: 'Assigner must be a supervisor' });
            }

            // Update order
            const updatedOrder = await this.orderRepository.updateOrder(orderId, {
                employeeId,
                status: 'Assigned',
                assignedBySupervisorId,
                assignedAt: new Date()
            });

            res.status(200).json(updatedOrder);
        } catch (error) {
            console.error('Error assigning order:', error);
            if (error instanceof Error) {
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

            const order = await this.orderRepository.findOrderById(orderId);
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

            const orders = await this.orderRepository.findOrdersByCustomerId(customerId);
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

            const orders = await this.orderRepository.findOrdersByEmployeeId(employeeId);
            res.status(200).json(orders);
        } catch (error) {
            console.error('Error getting employee orders:', error);
            res.status(500).json({ error: 'Internal server error while fetching employee orders' });
        }
    }
}

// Factory function to create the controller with all dependencies
export const createOrderController = (
    orderRepository: OrderRepository,
    garmentRepository: GarmentRepository,
    employeeRepository: EmployeeRepository
) => {
    return new OrderController(orderRepository, garmentRepository, employeeRepository);
};
