import { OrderStatus } from "../entities/Order";
import { OrderService } from "../services/order-service";
import { EmployeeService } from "../services/employee-service";
import { Employee } from "../entities/Employee";

export class UpdateOrderStatus {
    constructor(
        private readonly orderService: OrderService,
        private readonly employService: EmployeeService
    ) {}
    async execute(orderId: string, newStatus: string, employeeId: string): Promise<void> {
        const order = await this.orderService.findOrderById(orderId);
        const employee = await this.employService.findEmployeeById(employeeId);
        if (!order) {
            throw new Error("Order not found");
        }
        if(!employee) {
            throw new Error("Employee not found");
        }
        if(order.employeeId !== employee.id) {
            throw new Error("Unauthorized to update this order");
        }
        order.status = newStatus as OrderStatus;
        await this.orderService.updateOrder(orderId, order);
    }
}