import { Order } from "../entities/Order";
import { Employee } from "../entities/Employee";
import { OrderDetail } from "../entities/OrderDetail";
import { Garment } from "../entities/Garment";
import { ListOrderByEmployee } from "./list-order-by-employee";
import { describe, it, expect, beforeEach } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { createMockEmployeeService } from "../mocks/mock-employee-service";

describe("List Order By Employee Use Case", () => {
    let listOrderByEmployeeUseCase: ListOrderByEmployee;
    let mockOrderService: ReturnType<typeof createMockOrderService>;
    let mockEmployeeService: ReturnType<typeof createMockEmployeeService>;
    let employees: Employee[];
    let garments: Garment[];
    let orderDetail: OrderDetail;
    let orders: Order[];

    employees = [
      { id: "emp1", name: "Alice", surname: "Wonder", documentNumber: "123", phone: "555-1234", employeeType: "Costurero" },
      { id: "emp2", name: "Bob", surname: "Builder", documentNumber: "456", phone: "555-5678", employeeType: "Cortador" },
    ];
    garments = [
        { id: "gar1", name: "shirt", color: "red", price: 20, imageUrl: "", neck: "V", cuff: "red", flap: "", zipper: "2", pocket: "front", waist: "red" },
        { id: "gar2", name: "shorts" , color: "blue", price: 15, imageUrl: "", neck: "", cuff: "", flap: "", zipper: "3", pocket: "side", waist: "blue" },
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
    listOrderByEmployeeUseCase = new ListOrderByEmployee( 
        mockOrderService = createMockOrderService(orders)
    );
  });
  

  it("should list orders for a given employee", async () => {
    const employeeId = "emp1";
    const result = await listOrderByEmployeeUseCase.execute(employeeId);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("order1");
    expect(result[1].id).toBe("order2");
  });
    it("should return an empty array if the employee has no orders", async () => {
    const employeeId = "emp3"; // Employee with no orders
    const result = await listOrderByEmployeeUseCase.execute(employeeId);
    expect(result).toHaveLength(0);
  });

  it("should handle multiple orders for the same employee", async () => {
    orders.push(
      {
        id: "order3",
        customerId: "cust1",
        employeeId: "emp1",
        orderDetails: [orderDetail],
        orderDate: new Date(),
        deliveryDate: new Date(2025, 11, 26),
      }
    );
    const employeeId = "emp1";
    const result = await listOrderByEmployeeUseCase.execute(employeeId);
    expect(result).toHaveLength(3);
    expect(result.map(o => o.id)).toContain("order1");
    expect(result.map(o => o.id)).toContain("order3");
  });
  it("should return all the details of the orders", async () => {
    const employeeId = "emp1";
    const result = await listOrderByEmployeeUseCase.execute(employeeId);
    expect(result[0].orderDetails).toHaveLength(1);
    expect(result[0].orderDetails[0].garmentId).toBe("gar1");
    expect(result[0].orderDetails[0].quantity).toBe(2);
    expect(result[0].orderDetails[0].subtotal).toBe(40);
  });
});