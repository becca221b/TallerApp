import { describe, it, expect, vi } from "vitest";
import { LoginUser } from "./login-user";
import { mockUserService } from "../mocks/mock-user-service";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';

// Mock bcrypt.compare
vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn()
    }
}));

describe("LoginUser Use Case", () => {
    const loginService = mockUserService();
    const loginUser = new LoginUser(loginService);
    it("should successfully login with valid credentials", async () => {
        const mockUser: User = {
            id: "1",
            username: "testuser",
            passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz",  // Mocked bcrypt hash
            role: "admin"
        };

        // Mock findUserByName to return our test user
        loginService.findUserByName = vi.fn().mockResolvedValueOnce(mockUser);
        
        // Mock bcrypt.compare to return true (password matches)
        (bcrypt.compare as any).mockResolvedValueOnce(true);

        const result = await loginUser.execute({ username: "testuser", password: "password123" });
        expect(result.user).toEqual(mockUser);
        expect(loginService.findUserByName).toHaveBeenCalledWith("testuser");
        expect(bcrypt.compare).toHaveBeenCalledWith("password123", mockUser.passwordHash);
    });

    it("should fail to login with wrong password", async () => {
        const mockUser: User = {
            id: "1",
            username: "testuser",
            passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz",
            role: "admin"
        };

        // Mock findUserByName to return the user
        loginService.findUserByName = vi.fn().mockResolvedValueOnce(mockUser);
        
        // Mock bcrypt.compare to return false (password doesn't match)
        (bcrypt.compare as any).mockResolvedValueOnce(false);

        await expect(loginUser.execute({ 
            username: "testuser", 
            password: "wrongpassword" 
        })).rejects.toThrow("Contraseña incorrecta");
        
        expect(loginService.findUserByName).toHaveBeenCalledWith("testuser");
        expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", mockUser.passwordHash);
    });

    it("should fail to login with non-existent user", async () => {
        // Mock findUserByName to return null for invalid user
        loginService.findUserByName = vi.fn().mockResolvedValueOnce(null);
        
        await expect(loginUser.execute({ 
            username: "invaliduser", 
            password: "wrongpassword" 
        })).rejects.toThrow("Usuario no encontrado");
        
        expect(loginService.findUserByName).toHaveBeenCalledWith("invaliduser");
        // bcrypt.compare should not be called if user is not found
        //expect(bcrypt.compare).not.toHaveBeenCalled();
    });

});