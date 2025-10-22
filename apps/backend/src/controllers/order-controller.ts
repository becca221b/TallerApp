import { Request, Response } from "express";
import { CreateOrder } from "@/domain/use-cases/create-order";
import { OrderRepository } from "../repositories/OrderRepository";
import { GarmentRepository } from "../repositories/GarmentRepository";
import { AssignOrder } from "@/domain/use-cases/assign-order";
import { EmployeeRepository } from "../repositories/EmployRepository";

export class OrderController {

    constructor (private orderRepository: OrderRepository, private garmentRepository: GarmentRepository, private employeeRepository: EmployeeRepository) {}
    
    async createOrder(req: Request, res: Response):Promise<void> {
        try {
            const { customerId, employeeId, deliveryDate, garments } = req.body;
            
            const order = await new CreateOrder(this.orderRepository, this.garmentRepository).createOrderDetail({
                garmentId: garments.garmentId,
                quantity: garments.quantity,
                size: garments.size, 
                sex: garments.sex, 
                subtotal: garments.subtotal});
            res.status(201).json({ message: "Order created successfully", order });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
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
}