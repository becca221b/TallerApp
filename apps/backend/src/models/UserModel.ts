import { Schema, model } from 'mongoose';
import { User } from '@/domain/entities/User';

const UserSchema = new Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['supervisor', 'costurero'], required: true },
    email: { 
        type: String,
        required: false,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    },
});

export const UserModel = model('User', UserSchema);