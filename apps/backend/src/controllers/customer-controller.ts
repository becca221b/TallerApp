import { Request, Response } from 'express';
import { CustomerService } from '@/domain/services/customer-service';
import { Customer } from '@/domain/entities/Customer';

export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ) {}

    async createCustomer(req: Request, res: Response) {
        try {
            const customerData: Customer = req.body;

            // Validate required fields
            if (!customerData.customerName || !customerData.phone || !customerData.address) {
                return res.status(400).json({ 
                    error: 'Missing required fields. Required: customerName, phone, address' 
                });
            }

            const customer = await this.customerService.saveCustomer(customerData);
            res.status(201).json(customer);
        } catch (error) {
            console.error('Error creating customer:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error while creating customer' });
            }
        }
    }

    async getCustomer(req: Request, res: Response) {
        try {
            const customerId = req.params.id;
            if (!customerId) {
                return res.status(400).json({ error: 'Customer ID is required' });
            }

            const customer = await this.customerService.findCustomerById(customerId);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            res.status(200).json(customer);
        } catch (error) {
            console.error('Error getting customer:', error);
            res.status(500).json({ error: 'Internal server error while fetching customer' });
        }
    }

}

// Factory function to create the controller with dependencies
export const createCustomerController = (customerService: CustomerService) => {
    return new CustomerController(customerService);
};
