import { vi } from "vitest";
import type { UserService } from "../services/user-service";
import type { User } from "../entities/User";

export const mockUserService = (
    users: User[] = []
): UserService => {
    return {
        saveUser: vi.fn().mockImplementation(async (user: User) => {
            users.push(user);
            return user;
        }),
        findUserByName: vi.fn().mockImplementation(async (name: string) => {
            return users.find(user => user.username === name) || null;
        }),
        findUserById: vi.fn().mockImplementation(async (id: string) => {
            return users.find(user => user.id === id) || null;
       }),
        updateUser: vi.fn().mockImplementation(async (id: string, userUpdate: Partial<User>) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) return null;
            users[userIndex] = { ...users[userIndex], ...userUpdate };
            return users[userIndex];
        }),
        deleteUser: vi.fn().mockImplementation(async (id: string) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) return false;
            users.splice(userIndex, 1);
            return true;
        })
    }
}