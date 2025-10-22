import { UserService } from "@/domain/services/user-service";
import { UserModel } from "../models/UserModel";
import { User } from "@/domain/entities/User";

export class UserRepository implements UserService {
    
    async saveUser(user: User): Promise<User> {
        const newUser = await UserModel.create(user);
        // Transform the Mongoose document to User type
        const userData: User = {
            id: newUser._id.toString(),
            username: newUser.username,
            passwordHash: newUser.passwordHash,
            role: newUser.role
        };
        
        // Only add email if it exists
        if (newUser.email) {
            userData.email = newUser.email;
        }
        
        return userData;
    }

    async findUserByName(name: string): Promise<User | null> {
        const user = await UserModel.findOne({ username: name });
        if (!user) return null;
        
        return {
            id: user._id.toString(),
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role as 'admin' | 'employee',
            ...(user.email && { email: user.email })
        };
    }

    async findUserById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;
        
        return {
            id: user._id.toString(),
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role as 'admin' | 'employee',
            ...(user.email && { email: user.email })
        };
    }

    async findUsersByEmployeeId(employeeId: string): Promise<User[]> {
        const users = await UserModel.find({ employeeId });
        return users.map(user => ({
            id: user._id.toString(),
            username: user.username,
            passwordHash: user.passwordHash,
            role: user.role as 'admin' | 'employee',
            ...(user.email && { email: user.email })
        }));
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: userData },
            { new: true }
        );
        
        if (!updatedUser) {
            return null;
        }

        return {
            id: updatedUser._id.toString(),
            username: updatedUser.username,
            passwordHash: updatedUser.passwordHash,
            role: updatedUser.role as 'admin' | 'employee',
            ...(updatedUser.email && { email: updatedUser.email })
        };
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result !== null;
    }
}