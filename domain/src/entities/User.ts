export class User {
  constructor(public message: string){}
  
  sayHello() {
    return `Hello, ${this.message}!`;
  }
}