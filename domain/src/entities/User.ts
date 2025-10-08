export type Role = 'admin' | 'employee' | 'supervisor ';

export interface User {
  readonly id: string,
  username: string,
  passwordHash: string,
  role: Role,
  email?: string,
}
  
