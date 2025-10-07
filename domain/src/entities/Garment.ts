export type GarmentType = 'shirt' | 'shorts' | 'jacket'  ;



export class Garment {
    constructor(
        public readonly id: string,
        public garmentType: string,
        public color: string,
        public size: string,
        public quantity: number,
        public description?: string,
        public imageUrl?: string
    ) {}

    
}