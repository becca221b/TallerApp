<<<<<<< HEAD
export class User{
    constructor(public id:number, public name:string){}

    greet(){
        return 'Hola soy ';
    }
}
=======
export type Role = 'admin' | 'employee' ;

export interface User {
  readonly id: string,
  username: string,
  passwordHash: string,
  role: Role,
  email?: string,
}
  
>>>>>>> backend
