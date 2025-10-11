import { Customer } from "../entities/Customer";
import { describe, it, expect } from "vitest";
import { createMockCustomerService } from "../mocks/mock-customer-service";

describe('Create a customer',()=>{
    it('should create a customer', async()=>{
        const mockCustomerService = createMockCustomerService();
        
        const newCustomer: Customer = {
            id: '1',
            customerName: 'Club Atlético',
            phone: 5551234,
            address: 'Calle Falsa 123'
        }
        
        const savedCustomer = await mockCustomerService.saveCustomer(newCustomer);
        expect(savedCustomer).toEqual(newCustomer);
        expect(mockCustomerService.saveCustomer).toHaveBeenCalledWith(newCustomer);
    });

    it('should throw error if customerName is empty', async()=>{
        const mockCustomerService = createMockCustomerService();
        const createCustomerUseCase = new (await import('./create-customer')).CreateCustomer(mockCustomerService);  
        const newCustomer: Customer = {
            id: '2',
            customerName: '',
            phone: 5555678,
            address: 'Avenida Siempre Viva 742'
        }
        await expect(createCustomerUseCase.saveCustomer(newCustomer)).rejects.toThrow('Customer name is required');
        expect(mockCustomerService.saveCustomer).not.toHaveBeenCalled();
    });

    it('should throw error if phone number is not a number', async()=>{
        const mockCustomerService = createMockCustomerService();
        const createCustomerUseCase = new (await import('./create-customer')).CreateCustomer(mockCustomerService);  
        const newCustomer: Customer = {
            id: '3',
            customerName: 'Springfield Nuclear',
            phone: NaN,
            address: 'Nuclear Plant Rd'
        }
        await expect(createCustomerUseCase.saveCustomer(newCustomer)).rejects.toThrow('Phone number must be a valid number');
        expect(mockCustomerService.saveCustomer).not.toHaveBeenCalled();
    })
 })
