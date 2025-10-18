import { Order } from "../entities/Order";
import { OrderService } from "../services/order-service";
import { EmployeeService } from "../services/employee-service";

export class ListOrderByEmployee {
    constructor(
        private readonly orderService: OrderService
    ) {}

    async execute(employeeId: string): Promise<Order[]> {
        return this.orderService.findOrdersByEmployeeId(employeeId);
    }
}