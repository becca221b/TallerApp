import { OrderService } from "../services/order-service";
import { EmployeeService } from "../services/employee-service";
import { Order, OrderStatus } from "../entities/Order";
import { Employee, employeeType } from "../entities/Employee";

export interface AssignOrderParams {
    orderId: string;
    employeeId: string;
    assignedBySupervisorId: string;
}

export class AssignOrder {
    constructor(
        private readonly orderService: OrderService,
        private readonly employeeService: EmployeeService
    ) {}

    /**
     * Assign an order to an employee
     * Business rule: Only supervisors can assign orders
     */
    async assignOrder(params: AssignOrderParams): Promise<Order> {
        // Validate that the assigner is a supervisor
        await this.validateSupervisor(params.assignedBySupervisorId);

        // Get the order to assign
        const order = await this.orderService.findOrderById(params.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Validate that the target employee exists and is active
        const employee = await this.employeeService.findEmployeeById(params.employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }

        if (!employee.isActive) {
            throw new Error('Cannot assign order to inactive employee');
        }

        // Validate that the employee is a costurero (sewing employee)
        if (employee.employeeType !== 'Costurero') {
            throw new Error('Orders can only be assigned to sewing employees (Costurero)');
        }

        // Validate order status - can only assign pending orders
        if (order.status !== OrderStatus.Pending) {
            console.log("The order Status: " + order.status);
            throw new Error('Can only assign pending orders');
        }

        // Update the order with new employee assignment and status
        const updatedOrder = {
            ...order,
            employeeId: params.employeeId,
            status: OrderStatus.InProcess
        };

        // Save the updated order
        await this.orderService.updateOrder(params.orderId, updatedOrder);

        return updatedOrder;
    }

    /**
     * Reassign an order from one employee to another
     */
    async reassignOrder(params: AssignOrderParams): Promise<Order> {
        // Validate that the assigner is a supervisor
        await this.validateSupervisor(params.assignedBySupervisorId);

        // Get the order to reassign
        const order = await this.orderService.findOrderById(params.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Validate that the target employee exists and is active
        const employee = await this.employeeService.findEmployeeById(params.employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }

        if (!employee.isActive) {
            throw new Error('Cannot reassign order to inactive employee');
        }

        // Validate that the employee is a costurero (sewing employee)
        if (employee.employeeType !== 'Costurero') {
            throw new Error('Orders can only be assigned to sewing employees (Costurero)');
        }

        // Validate order status - can reassign pending or in-process orders
        if (order.status === OrderStatus.Completed) {
            throw new Error('Cannot reassign completed orders');
        }

        // Update the order with new employee assignment
        const updatedOrder: Order = {
            ...order,
            employeeId: params.employeeId,
            status: OrderStatus.InProcess
        };

        // Save the updated order
        return await this.orderService.saveOrder(updatedOrder);
    }

    /**
     * Get orders assigned to a specific employee
     */
    async getOrdersByEmployee(employeeId: string): Promise<Order[]> {
        // Validate that the employee exists
        const employee = await this.employeeService.findEmployeeById(employeeId);
        if (!employee) {
            throw new Error('Employee not found');
        }

        // Get all orders assigned to this employee
        return await this.orderService.findOrdersByEmployeeId(employeeId);
    }

    /**
     * Unassign an order (set back to pending without employee assignment)
     */
    async unassignOrder(orderId: string, supervisorId: string): Promise<Order> {
        // Validate that the supervisor exists and has permission
        await this.validateSupervisor(supervisorId);

        // Get the order to unassign
        const order = await this.orderService.findOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Validate order status - can only unassign pending or in-process orders
        if (order.status === OrderStatus.Completed) {
            throw new Error('Cannot unassign completed orders');
        }

        // Update the order to remove employee assignment and set to pending
        const updatedOrder: Order = {
            ...order,
            employeeId: '', // Remove employee assignment
            status: OrderStatus.Pending
        };

        // Save the updated order
        return await this.orderService.saveOrder(updatedOrder);
    }

    /**
     * Private method to validate that an employee is a supervisor
     */
    private async validateSupervisor(employeeId: string): Promise<void> {
        const supervisor = await this.employeeService.findEmployeeById(employeeId);
        
        if (!supervisor) {
            throw new Error('Supervisor not found');
        }

        if (!supervisor.isActive) {
            throw new Error('Supervisor is not active');
        }

        if (supervisor.employeeType !== 'Supervisor') {
            throw new Error('Only supervisors can assign orders');
        }
    }
}
