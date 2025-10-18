import type { Customer } from "../entities/Customer.js";
import type { CustomerService } from "../services/customer-service.js";

export class CreateCustomer {
    constructor(private customerService: CustomerService) {}

    async saveCustomer(customer: Customer): Promise<Customer> {
        if (!customer.customerName || customer.customerName.trim() === '') {
            throw new Error('Customer name is required');
        }

        if (isNaN(customer.phone) || !Number.isFinite(customer.phone)) {
            throw new Error('Phone number must be a valid number');
        }

        return await this.customerService.saveCustomer(customer);
    }
}
