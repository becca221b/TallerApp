import type { Customer } from "../entities/Customer";

export interface CustomerService {
  saveCustomer(customer: Customer): Promise<Customer>;
  findCustomerById(id: string): Promise<Customer | null>;
  //findCustomerByName(name: string): Promise<Customer | null>;
  //updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer | null>;
}
