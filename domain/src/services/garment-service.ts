import type { Garment } from "../entities/Garment.js";

export interface GarmentService {
    saveGarment(garment: Garment): Promise<Garment>;
    findGarmentById(id: string): Promise<Garment | null>;
    findGarmentPriceById(id: string): Promise<number | null>;
}
