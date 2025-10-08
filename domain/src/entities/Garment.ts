export type GarmentType = 'shirt' | 'shorts' | 'jacket'  ;

export interface Garment {
    
    id: string,
    garmentType: string,
    color: string,
    size: string,
    description?: string,
    price: number,
    imageUrl: string
    quantity: number
}