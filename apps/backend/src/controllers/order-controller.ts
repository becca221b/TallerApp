import { Request, Response } from "express";
import { CreateOrder } from "@/domain/use-cases/create-order";
import { OrderRepository } from "../repositories/OrderRepository";
import { GarmentRepository } from "../repositories/GarmentRepository";
import { AssignOrder } from "@/domain/use-cases/assign-order";
import { UpdateOrderStatus } from "@/domain/use-cases/update-order-status";
import { EmployeeRepository } from "../repositories/EmployRepository";

export class OrderController {

    constructor (private orderRepository: OrderRepository, private garmentRepository: GarmentRepository, private employeeRepository: EmployeeRepository) {}
    
        
    async createOrder(req: Request, res: Response):Promise<void> {
         try {
            const { customerId, employeeId, deliveryDate, orderDetails } = req.body;
            
            if (!customerId) {
                throw new Error('Missing required field: customerId');
            }
            if (!deliveryDate) {
                throw new Error('Missing required field: deliveryDate');
            }
            if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
                throw new Error('Invalid or empty order details array');
            }

            const createOrder = new CreateOrder(
                this.orderRepository, 
                this.garmentRepository
            );

            const orderDetail = await Promise.all(
            orderDetails.map(garment => 
                createOrder.createOrderDetail({
                    id: garment.id,
                    quantity: garment.quantity,
                    size: garment.size,
                    sex: garment.sex,
                    subtotal: garment.price
                })
            )
            );

            const order = await createOrder.createCompleteOrder(
                {
                    customerId,
                    employeeId,
                    deliveryDate,
                }, orderDetails
            );
        res.status(201).json({ message: "Order created successfully", order });
        } catch (error: any) {
            res.status(400).json({ message: error.message, error });
        }
    }

    async assignOrder(req: Request, res: Response):Promise<void> {
        try {
            const { orderId, employeeId, assignedBySupervisorId } = req.body;
            
            const order = await new AssignOrder(this.orderRepository, this.employeeRepository).assignOrder({orderId, employeeId, assignedBySupervisorId});
            res.status(200).json({ message: "Order assigned successfully", order });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    
    async getOrdersByEmployeeId(req: Request, res: Response):Promise<void> {
        try {
            const { employeeId } = req.params;
            const orders = await this.orderRepository.findOrdersByEmployeeId(employeeId);
            res.status(200).json({ orders });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateOrderStatus(req: Request, res: Response):Promise<void> {
        try {
            const { orderId, newStatus, employeeId } = req.body;
            
            const order = await new UpdateOrderStatus(this.orderRepository, this.employeeRepository).execute(orderId, newStatus, employeeId);
            res.status(200).json({ message: "Order status updated successfully", order });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOrders(req: Request, res: Response):Promise<void> {
        try {
            const orders = await this.orderRepository.findAllOrders();
            res.status(200).json({ orders });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}