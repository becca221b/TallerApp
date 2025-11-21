export type Role = 'supervisor' | 'costurero' ;

export interface User {
  readonly id: string,
  username: string,
  passwordHash: string,
  role: Role,
  email?: string,
}
  
