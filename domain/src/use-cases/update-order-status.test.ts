import { UpdateOrderStatus } from "./update-order-status";
import { describe, it, expect, beforeEach } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { createMockEmployeeService } from "../mocks/mock-employee-service";
import { Employee } from "../entities/Employee";
import { OrderDetail } from "../entities/OrderDetail";
import { Order } from "../entities/Order";

describe("Update Order Status Use Case", () => {
    let updateOrderStatusUseCase: UpdateOrderStatus;
    let mockOrderService: ReturnType<typeof createMockOrderService>;
    let mockEmployeeService: ReturnType<typeof createMockEmployeeService>;
    let employees: Employee[];
    let orders: Order[];
    let orderDetail: OrderDetail;

    employees = [
      { id: "emp1", name: "Alice", surname: "Wonder", documentNumber: "123", phone: "555-1234", employeeType: "costurero" },
      { id: "emp2", name: "Bob", surname: "Builder", documentNumber: "456", phone: "555-5678", employeeType: "cortador" },
    ];

    orderDetail = {
        id: "od1",
        garmentId: "gar1",
        quantity: 2,
        size: "M",
        sex: "M",
        subtotal: 40,
    }
    orders = [
      {
        id: "order1",
        customerId: "cust1",
        employeeId: "emp1",
        orderDetails: [orderDetail],
        orderDate: new Date(),
        deliveryDate: new Date(2025, 11, 25),
      },
      {
        id: "order2",
        customerId: "cust2",
        employeeId: "emp1",
        orderDetails: [orderDetail],
        orderDate: new Date(),
        deliveryDate: new Date(2025, 11, 26),
      },
    ];

    beforeEach(() => {
        updateOrderStatusUseCase = new UpdateOrderStatus(
            mockOrderService = createMockOrderService(orders),
            mockEmployeeService = createMockEmployeeService(employees)
        );

    })
    it("should update the status of an order", async () => {
        const orderId = "order1";
        const newStatus = "Completed";
        const employeeId = "emp1";
        await updateOrderStatusUseCase.execute(orderId, newStatus, employeeId);

        const updatedOrder = await mockOrderService.findOrderById(orderId);
        expect(updatedOrder?.status).toBe(newStatus);
    });
    it("should throw an error if another employee want to update another employee's order", async () => {
        const orderId = "order2";
        const newStatus = "Completed";
        const employeeId = "emp2"; // Different employee

        await expect(updateOrderStatusUseCase.execute(orderId, newStatus, employeeId)).rejects.toThrow("Unauthorized to update this order");
    });
    it("should throw an error if the order does not exist", async () => {
        const orderId = "nonexistentOrder";
        const newStatus = "Completed";
        const employeeId = "emp1";
        await expect(updateOrderStatusUseCase.execute(orderId, newStatus, employeeId)).rejects.toThrow("Order not found");
    });
});