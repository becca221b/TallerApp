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
            
            if (!customerId || !employeeId || !deliveryDate || !Array.isArray(garments)) {
                throw new Error('Missing required fields. Required: customerId, employeeId, deliveryDate, garments[]');
            }

            const createOrder = new CreateOrder(
                this.orderRepository, 
                this.garmentRepository
            );

            const orderDetails = await Promise.all(
            garments.map(garment => 
                createOrder.createOrderDetail({
                    garmentId: garment.garmentId,
                    quantity: garment.quantity,
                    size: garment.size,
                    sex: garment.sex,
                    subtotal: garment.subtotal
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
}