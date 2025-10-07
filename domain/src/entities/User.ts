export type Role = 'admin' | 'employee' | 'supervisor ';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public surname: string,
    public documentNumber: string,
    private passwordHash: string,
    public role: Role,
    public isActive: boolean=true,
    public email?: string,
  ){}
  
  getPasswordHash() {
    return this.passwordHash;
  }

  switchActive() {
    this.isActive = !this.isActive;
  }

  changeRole(newRole: Role) {
    this.role = newRole;
  }
}