import { CustomerService } from '@/domain/services/customer-service';
import { Customer } from '@/domain/entities/Customer';
import { CustomerModel } from '../models/CustomerModel';

export class CustomerRepository implements CustomerService {
    async saveCustomer(customer: Customer): Promise<Customer> {
        const customerDoc = new CustomerModel(customer);
        const savedCustomer = await customerDoc.save();
        return savedCustomer.toJSON() as Customer;
    }

    async findCustomerById(id: string): Promise<Customer | null> {
        const customer = await CustomerModel.findOne({ id }).exec();
        return customer ? customer.toJSON() as Customer : null;
    }

}
