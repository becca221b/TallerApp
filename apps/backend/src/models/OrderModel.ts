import { Schema, model } from 'mongoose';
import { Order, OrderStatus } from '@/domain/entities/Order';
import { OrderDetailModel } from './OrderDetailModel';


const OrderSchema = new Schema<Order>({
    id: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    employeeId: { type: String, required: true },
    orderDate: { type: Date, required: true, default: Date.now },
    status: { 
        type: String,
        enum: Object.values(OrderStatus),
        required: true,
        default: OrderStatus.Pending
    },
    totalPrice: { type: Number, required: false, min: 0 },
    orderDetails: [OrderDetailModel], 
    deliveryDate: { type: Date, required: true },
});

export const OrderModel = model('Order', OrderSchema);