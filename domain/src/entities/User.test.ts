import {describe, it, expect} from 'vitest';
import { User } from './User';

describe('User entity', () => {
  it('should create a user and return the right message', () => {
    const user = new User('1', 'John', 'Doe', '123456789', 'hashedPassword', 'admin');
    expect(user.name).toBe('John');
    expect(user.isActive).toBe(true);
  });
});

describe('User entity methods', () => {
  it('should deactivate a user', () => {
    const user = new User('1', 'John', 'Doe', '123456789', 'hashedPassword', 'admin');
    user.switchActive();
    expect(user.isActive).toBe(false);
  });

  it('should change the user role', () => {
    const user = new User('1', 'John', 'Doe', '123456789', 'hashedPassword', 'employee');
    user.changeRole('admin');
    expect(user.role).toBe('admin');
  });
});