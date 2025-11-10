export interface OrderDetail {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export type UserRole = 'supervisor' | 'costurero';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export type OrderStatus = 'pendiente' | 'en-proceso' | 'completada';

export interface Order {
  id: string;
  clientName: string;
  orderDetails: OrderDetail[];
  deliveryDate: string;
  status: OrderStatus;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}
