import type { User } from '../entities/User.js';

export interface UserService {
  saveUser(user: User): Promise<User>;
  findUserByName(name: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  updateUser(id: string, user: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
}
