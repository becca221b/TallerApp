export type Role = 'admin' | 'employee' ;

export interface User {
  readonly id: string,
  username: string,
  passwordHash: string,
  role: Role,
  email?: string,
}
  
