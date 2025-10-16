import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockOrderService } from "../mocks/mock-order-service";
import { createMockEmployeeService } from "../mocks/mock-employee-service";
import { AssignOrder, AssignOrderParams } from "./assign-order";
import { Order, OrderStatus } from "../entities/Order";
import { Employee, employeeType } from "../entities/Employee";

describe('AssignOrder Use Case', () => {
    let assignOrderUseCase: AssignOrder;
    let mockOrderService: ReturnType<typeof createMockOrderService>;
    let mockEmployeeService: ReturnType<typeof createMockEmployeeService>;

    const mockSupervisor: Employee = {
        id: 'supervisor-1',
        name: 'Maria',
        surname: 'Garcia',
        documentNumber: '12345678',
        phone: '555-0001',
        isActive: true,
        employeeType: 'Supervisor',
        username: 'maria.garcia',
        password: 'password123'
    };

    const mockCosturero: Employee = {
        id: 'costurero-1',
        name: 'Juan',
        surname: 'Perez',
        documentNumber: '87654321',
        phone: '555-0002',
        isActive: true,
        employeeType: 'Costurero'
    };

    const mockInactiveCosturero: Employee = {
        id: 'costurero-2',
        name: 'Pedro',
        surname: 'Lopez',
        documentNumber: '11223344',
        phone: '555-0003',
        isActive: false,
        employeeType: 'Costurero'
    };

    const mockCortador: Employee = {
        id: 'cortador-1',
        name: 'Ana',
        surname: 'Martinez',
        documentNumber: '55667788',
        phone: '555-0004',
        isActive: true,
        employeeType: 'Cortador'
    };

    const mockPendingOrder: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        status: OrderStatus.Pending,
        employeeId: '',
        orderDetails: [],
        orderDate: new Date('2024-01-01'),
        deliveryDate: new Date('2024-02-01')
    };

    const mockInProcessOrder: Order = {
        id: 'order-2',
        customerId: 'customer-2',
        status: OrderStatus.InProcess,
        employeeId: 'costurero-1',
        orderDetails: [],
        orderDate: new Date('2024-01-02'),
        deliveryDate: new Date('2024-02-02')
    };

    const mockCompletedOrder: Order = {
        id: 'order-3',
        customerId: 'customer-3',
        status: OrderStatus.Completed,
        employeeId: 'costurero-1',
        orderDetails: [],
        orderDate: new Date('2024-01-03'),
        deliveryDate: new Date('2024-02-03')
    };

    beforeEach(() => {
        mockOrderService = createMockOrderService([mockPendingOrder, mockInProcessOrder, mockCompletedOrder]);
        mockEmployeeService = createMockEmployeeService([mockSupervisor, mockCosturero, mockInactiveCosturero, mockCortador]);
        assignOrderUseCase = new AssignOrder(mockOrderService, mockEmployeeService);
        vi.clearAllMocks();
    });

    describe('assignOrder', () => {
        it('should successfully assign a pending order to a costurero', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            const result = await assignOrderUseCase.assignOrder(params);

            expect(result.employeeId).toBe('costurero-1');
            expect(result.status).toBe(OrderStatus.InProcess);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'order-1',
                    employeeId: 'costurero-1',
                    status: OrderStatus.InProcess
                })
            );
            expect(mockEmployeeService.findEmployeeById).toHaveBeenCalledWith('supervisor-1');
            expect(mockEmployeeService.findEmployeeById).toHaveBeenCalledWith('costurero-1');
        });

        it('should throw error when supervisor is not found', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'nonexistent-supervisor'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Supervisor not found');
        });

        it('should throw error when supervisor is not active', async () => {
            const inactiveSupervisor: Employee = {
                ...mockSupervisor,
                id: 'inactive-supervisor',
                isActive: false
            };
            
            mockEmployeeService = createMockEmployeeService([inactiveSupervisor, mockCosturero]);
            assignOrderUseCase = new AssignOrder(mockOrderService, mockEmployeeService);

            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'inactive-supervisor'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Supervisor is not active');
        });

        it('should throw error when assigner is not a supervisor', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'costurero-1' // Using costurero as assigner
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Only supervisors can assign orders');
        });

        it('should throw error when order is not found', async () => {
            const params: AssignOrderParams = {
                orderId: 'nonexistent-order',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Order not found');
        });

        it('should throw error when employee is not found', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'nonexistent-employee',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Employee not found');
        });

        it('should throw error when trying to assign to inactive employee', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-2', // Inactive costurero
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Cannot assign order to inactive employee');
        });

        it('should throw error when trying to assign to non-costurero employee', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'cortador-1', // Cortador instead of Costurero
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Orders can only be assigned to sewing employees (Costurero)');
        });

        it('should throw error when trying to assign non-pending order', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-2', // InProcess order
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Can only assign pending orders');
        });
    });

    describe('reassignOrder', () => {
        it('should successfully reassign an order from one employee to another', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-2', // InProcess order
                employeeId: 'costurero-1', // Different employee
                assignedBySupervisorId: 'supervisor-1'
            };

            const result = await assignOrderUseCase.reassignOrder(params);

            expect(result.employeeId).toBe('costurero-1');
            expect(result.status).toBe(OrderStatus.InProcess);
            expect(mockOrderService.saveOrder).toHaveBeenCalled();
        });

        it('should throw error when trying to reassign completed order', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-3', // Completed order
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.reassignOrder(params))
                .rejects.toThrow('Cannot reassign completed orders');
        });
    });

    describe('getOrdersByEmployee', () => {
        it('should return orders assigned to a specific employee', async () => {
            const orders = await assignOrderUseCase.getOrdersByEmployee('costurero-1');

            expect(orders).toHaveLength(2); // order-2 and order-3
            expect(orders.every(order => order.employeeId === 'costurero-1')).toBe(true);
            expect(mockOrderService.findOrdersByEmployeeId).toHaveBeenCalledWith('costurero-1');
        });

        it('should return empty array for employee with no orders', async () => {
            const orders = await assignOrderUseCase.getOrdersByEmployee('costurero-2');

            expect(orders).toHaveLength(0);
            expect(mockOrderService.findOrdersByEmployeeId).toHaveBeenCalledWith('costurero-2');
        });

        it('should throw error when employee is not found', async () => {
            await expect(assignOrderUseCase.getOrdersByEmployee('nonexistent-employee'))
                .rejects.toThrow('Employee not found');
        });
    });

    describe('unassignOrder', () => {
        it('should successfully unassign an order', async () => {
            const result = await assignOrderUseCase.unassignOrder('order-2', 'supervisor-1');

            expect(result.employeeId).toBe('');
            expect(result.status).toBe(OrderStatus.Pending);
            expect(mockOrderService.saveOrder).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'order-2',
                    employeeId: '',
                    status: OrderStatus.Pending
                })
            );
        });

        it('should throw error when trying to unassign completed order', async () => {
            await expect(assignOrderUseCase.unassignOrder('order-3', 'supervisor-1'))
                .rejects.toThrow('Cannot unassign completed orders');
        });

        it('should throw error when supervisor is not found', async () => {
            await expect(assignOrderUseCase.unassignOrder('order-2', 'nonexistent-supervisor'))
                .rejects.toThrow('Supervisor not found');
        });

        it('should throw error when order is not found', async () => {
            await expect(assignOrderUseCase.unassignOrder('nonexistent-order', 'supervisor-1'))
                .rejects.toThrow('Order not found');
        });
    });

    describe('Business Rules Validation', () => {
        it('should enforce that only supervisors can assign orders', async () => {
            const costureroParams: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'costurero-1'
            };

            await expect(assignOrderUseCase.assignOrder(costureroParams))
                .rejects.toThrow('Only supervisors can assign orders');

            const cortadorParams: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'cortador-1'
            };

            await expect(assignOrderUseCase.assignOrder(cortadorParams))
                .rejects.toThrow('Only supervisors can assign orders');
        });

        it('should enforce that orders can only be assigned to costureros', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'cortador-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(params))
                .rejects.toThrow('Orders can only be assigned to sewing employees (Costurero)');
        });

        it('should enforce that only pending orders can be initially assigned', async () => {
            const inProcessParams: AssignOrderParams = {
                orderId: 'order-2',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(inProcessParams))
                .rejects.toThrow('Can only assign pending orders');

            const completedParams: AssignOrderParams = {
                orderId: 'order-3',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            await expect(assignOrderUseCase.assignOrder(completedParams))
                .rejects.toThrow('Can only assign pending orders');
        });

        it('should automatically change order status to InProcess when assigned', async () => {
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            const result = await assignOrderUseCase.assignOrder(params);

            expect(result.status).toBe(OrderStatus.InProcess);
        });

        it('should handle supervisor workflow for order assignment', async () => {
            // Simulating supervisor workflow
            const params: AssignOrderParams = {
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            };

            const assignedOrder = await assignOrderUseCase.assignOrder(params);

            // Verify the assignment
            expect(assignedOrder.employeeId).toBe('costurero-1');
            expect(assignedOrder.status).toBe(OrderStatus.InProcess);

            // Verify costurero can see their assigned orders
            const employeeOrders = await assignOrderUseCase.getOrdersByEmployee('costurero-1');
            expect(employeeOrders.some(order => order.id === 'order-1')).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle multiple orders assigned to same employee', async () => {
            // Assign first order
            await assignOrderUseCase.assignOrder({
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            });

            // Employee should now have 3 orders (order-1, order-2, order-3)
            const orders = await assignOrderUseCase.getOrdersByEmployee('costurero-1');
            expect(orders).toHaveLength(3);
        });

        it('should handle reassignment between multiple costureros', async () => {
            // First assign to costurero-1
            await assignOrderUseCase.assignOrder({
                orderId: 'order-1',
                employeeId: 'costurero-1',
                assignedBySupervisorId: 'supervisor-1'
            });

            // Then reassign to a different costurero (create another one)
            const anotherCosturero: Employee = {
                id: 'costurero-3',
                name: 'Luis',
                surname: 'Rodriguez',
                documentNumber: '99887766',
                phone: '555-0005',
                isActive: true,
                employeeType: 'Costurero'
            };

            mockEmployeeService = createMockEmployeeService([mockSupervisor, mockCosturero, anotherCosturero]);
            assignOrderUseCase = new AssignOrder(mockOrderService, mockEmployeeService);

            const reassignedOrder = await assignOrderUseCase.reassignOrder({
                orderId: 'order-1',
                employeeId: 'costurero-3',
                assignedBySupervisorId: 'supervisor-1'
            });

            expect(reassignedOrder.employeeId).toBe('costurero-3');
        });
    });
});
