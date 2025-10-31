import { vi } from "vitest";
import type { CustomerService } from "../services/customer-service";
import type { Customer } from "../entities/Customer";

export const createMockCustomerService = (
  customers: Customer[] = []
): CustomerService => {
    return {
        saveCustomer: vi.fn().mockImplementation(async (customer: Customer) => {
            customers.push(customer);
            return customer;
        }),
        findCustomerById: vi.fn().mockImplementation(async (id: string) => {
            return customers.find(customer => customer.id === id) || null;
        })
    }
}
