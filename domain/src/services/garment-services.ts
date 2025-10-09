import { Garment } from "../entities/Garment";

export interface GarmentService {
    saveGarment(garment: Garment): Promise<Garment>;
    findGarmentById(id: string): Promise<Garment | null>;
    findGarmentByType(type: string): Promise<Garment | null>;
    updateGarment(id: string, garment: Partial<Garment>): Promise<Garment | null>;  
}