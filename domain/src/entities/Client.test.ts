import { describe, it, expect } from "vitest";
import { Client } from "./Client";

describe('Client entity', () => {
  it('should create a client', () => {
    const client = new Client('1', 'John Doe', '1234567890', '');
    expect(client).toBeInstanceOf(Client);
    expect(client.clientName).toBe('John Doe');
    expect(client.phone).toBe('1234567890');
    expect(client.email).toBe('');
  });
});
describe('Client entity', () => {
  it('should update client phone', () => {
    const client = new Client('1', 'John Doe', '1234567890', 'john@yahoo.com.ar');
    client.updateClient('0987654321','');
    expect(client.phone).toBe('0987654321');
    expect(client.email).toBe('john@yahoo.com.ar'); // email remains unchanged
    });
});
describe('Client entity', () => {
  it('should update client email', () => {
    const client = new Client('1', 'John Doe', '1234567890', '');
    client.updateClient('','john@yahoo.com.ar');
    expect(client.phone).toBe('1234567890'); // phone remains unchanged
    expect(client.email).toBe('john@yahoo.com.ar'); 
    });
});
    