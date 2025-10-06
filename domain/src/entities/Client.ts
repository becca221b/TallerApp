export class Client {
    constructor(
        public readonly id: string,
        public clientName: string,
        public phone: string,
        public email?: string,
        
    ) {}

    updateClient(phone: string, email?: string) {
        this.email = email;
        this.phone = phone;
    }
}