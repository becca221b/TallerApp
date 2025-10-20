import {User} from "@/domain/entities";
import { UserService } from "@/domain/services/user-service";
import { UserModel } from "src/models/UserModel";

export class UserRepository implements UserService{
    async saveUser(user: User): Promise<User> {
        const newUser = new UserModel(user);
        const saved = await newUser.save();
        return this.toDomain(saved);
    }

    async findUserByName(username: string): Promise<User | null> {
        const user = await UserModel.findOne({username});
        return user ? this.toDomain(username) : null;
    }

    async findUserById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        return user ? this.toDomain(user) : null;
    }
    async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        
        return user ? this.toDomain(user) : null;
    }
    async deleteUser(id: string): Promise<boolean> {
        return true;
    }

    private toDomain(userDoc: any): User {
    return {
      id: userDoc._id.toString(),
      username: userDoc.username,
      email: userDoc.email,
      passwordHash: userDoc.password,
      role: userDoc.role,
    };
  }
}
