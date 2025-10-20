import { Schema, model } from 'mongoose';
import { OrderDetail, orderSize } from '@/domain/entities/OrderDetail';

const OrderDetailSchema = new Schema<OrderDetail>({
    id: { type: String, required: true },
    garmentId: { type: String, required: true },
    orderId: { type: String, required: false }, // Optional since it's set when added to order
    quantity: { type: Number, required: true, min: 1 },
    size: { 
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    sex: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    subtotal: { type: Number, required: true, min: 0 }
}); 

export const OrderDetailModel = model('OrderDetail', OrderDetailSchema);