import { Schema, model } from 'mongoose';
import { Garment, GarmentType } from '@/domain/entities/Garment';

const GarmentSchema = new Schema<Garment>({
    id: { type: String, required: true, unique: true },
    name: { 
        type: String,
        enum: ['shirt', 'shorts', 'jacket'],
        required: true 
    },
    color: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    neck: { type: String, required: true },
    cuff: { type: String, required: true },
    flap: { type: String, required: true },
    zipper: { type: String, required: true },
    pocket: { type: String, required: true },
    waist: { type: String, required: true }
});

export const GarmentModel = model<Garment>('Garment', GarmentSchema);