import { Customer } from "../entities/Customer";
import { CustomerService } from "../services/customer-service";

export class CreateCustomer {
    constructor(private customerService: CustomerService) {}

    async saveCustomer(customer: Customer): Promise<Customer> {
        // Validate customer name
        if (!customer.customerName || customer.customerName.trim() === '') {
            throw new Error('Customer name is required');
        }

        // Validate phone number
        if (isNaN(customer.phone) || !Number.isFinite(customer.phone)) {
            throw new Error('Phone number must be a valid number');
        }

        // If all validations pass, save the customer
        return await this.customerService.saveCustomer(customer);
    }
}
