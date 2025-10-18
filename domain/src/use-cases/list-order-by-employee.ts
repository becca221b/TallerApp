import type { Order } from "../entities/Order.js";
import type { OrderService } from "../services/order-service.js";
import type { EmployeeService } from "../services/employee-service.js";

export class ListOrderByEmployee {
    constructor(
        private readonly orderService: OrderService
    ) {}

    async execute(employeeId: string): Promise<Order[]> {
        return this.orderService.findOrdersByEmployeeId(employeeId);
    }
}