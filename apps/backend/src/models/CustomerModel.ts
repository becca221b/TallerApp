import { Schema, model } from 'mongoose';
import { Customer } from '@/domain/entities/Customer';

const CustomerSchema = new Schema<Customer>({
    id: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: false }
}, {
    timestamps: true
});

// Create indices for commonly queried fields
CustomerSchema.index({ customerName: 1 });
CustomerSchema.index({ phone: 1 });

export const CustomerModel = model<Customer>('Customer', CustomerSchema);
