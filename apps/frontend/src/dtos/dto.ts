export interface User{
    id: string;
    username: string,
    role: 'costurero' | 'supervisor';
    token?: string;
}

export interface Customer{
    id:string;
    name: string;
    email?: string;
    phone?: string;
}

export interface Garment {
  garmentId: string;
  quantity: number;
  price: number;
  size: string;
  sex: 'M' | 'F' | 'U';
  subtotal?: number;
}

export interface Order {
    id?: string;
    customerId: string;
    employeeId?: string;
    customerName?: string;
    employeeName?: string;
    orderDetails: Garment[];
    totalPrice?: number;
    deliveryDate: string;
    createdAt?: string;
    updatedAt?: string;
    status?: 'pending' | 'in process' | 'completed';
}

export interface Employee {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    employeeType: 'costurero' | 'supervisor';
    username: string;
    password: string;
}