import type { Customer } from "../entities/Customer.js";

export interface CustomerService {
  saveCustomer(customer: Customer): Promise<Customer>;
  findCustomerById(id: string): Promise<Customer | null>;
}
