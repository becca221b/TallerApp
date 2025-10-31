import { vi } from "vitest";
import type { GarmentService } from '../services/garment-service';
import type { Garment } from "../entities/Garment";

export const mockGarmentService = (
    garments: Garment[] = []
): GarmentService => {
    return {
        findGarmentById: vi.fn().mockImplementation(async (id: string) => {
            return garments.find(g => g.id === id) || null;
        }),
        saveGarment: vi.fn().mockImplementation(async (garment: Garment) => {
            garments.push(garment);
            return garment;
        }),
        findGarmentPriceById: vi.fn().mockImplementation(async (id: string) => {
            const garment = garments.find(g => g.id === id);
            return garment ? garment.price : null;
        }),
    }
}
