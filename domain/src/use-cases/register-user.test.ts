import { describe, it, expect, vi, Mocked } from "vitest";
import { RegisterUser } from "./register-user";
import { mockUserService } from "../mocks/mock-user-service";
import { User } from "../entities/User";
import bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
    default: {
        hash: vi.fn().mockResolvedValue("mockedHash"),
        compare: vi.fn()
    }
}));

const mockedBcrypt = bcrypt as Mocked<typeof bcrypt>;

describe("RegisterUser Use Case", ()=>{
    const registerService = mockUserService();
    const registerUser = new RegisterUser(registerService);
    it("should successfully register a new user", async () => {
        const mockUser: User = {
            id: "1",
            username: "testuser",
            passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz",  // Mocked bcrypt hash
            role: "admin"
        };

        // Mock findUserByName to return null for new user
        registerService.findUserByName = vi.fn().mockResolvedValueOnce(null);
        
        const result = await registerUser.execute({ username: "testuser", password: "password123", role: "supervisor" });
        expect(result).toMatchObject({
            username: "testuser",
            role: "supervisor"
        });
        expect(registerService.findUserByName).toHaveBeenCalledWith("testuser");
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });
})