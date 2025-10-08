export type Role = 'admin' | 'employee' | 'supervisor ';

export interface User {
  readonly id: string,
  name: string,
  passwordHash: string,
  role: Role,
  email?: string,
}
  
