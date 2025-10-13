export type GarmentType = 'shirt' | 'shorts' | 'jacket'  ;

export interface Garment {
    id: string,
    name: GarmentType,
    color: string,
    description?: string,
    price: number,
    imageUrl: string,
    neck: string,
    cuff: string, //puño
    flap: string,
    zipper: string,
    pocket: string,
    waist: string,
}