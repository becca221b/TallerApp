import {describe, it, expect} from 'vitest';
import { User } from './User';

describe('User entity', () => {
  it('should create a user and return the right message', () => {
    const user = new User('World');
    expect(user.sayHello()).toBe('Hello, World!');
  });
});