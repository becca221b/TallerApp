import { GarmentService } from "@/domain/services/garment-service";
import { GarmentModel } from "../models/GarmentModel";
import { Garment } from "@/domain/entities/Garment";

export class GarmentRepository implements GarmentService {
    
    async saveGarment(garment: Garment): Promise<Garment> {
        const newGarment = await GarmentModel.create(garment);
        // Transform the Mongoose document to Garment type
        const garmentData: Garment = {
            id: newGarment._id.toString(),
            name: newGarment.name,
            description: newGarment.description,
            price: newGarment.price,
            color: newGarment.color,
            imageUrl: newGarment.imageUrl,
            neck: newGarment.neck,
            cuff: newGarment.cuff,
            flap: newGarment.flap,
            zipper: newGarment.zipper,
            pocket: newGarment.pocket,
            waist: newGarment.waist, 
        };
        return garmentData;
    }

    async findGarmentById(id: string): Promise<Garment | null> {
        const garment = await GarmentModel.findById(id);
        if (!garment) return null;
        
        return {
            id: garment._id.toString(),
            name: garment.name,
            description: garment.description,
            price: garment.price,
            color: garment.color,
            imageUrl: garment.imageUrl,
            neck: garment.neck,
            cuff: garment.cuff,
            flap: garment.flap,
            zipper: garment.zipper,
            pocket: garment.pocket,
            waist: garment.waist, 
        };
    }

    async findGarmentPriceById(id: string): Promise<number | null> {
        const garment = await GarmentModel.findById(id);
        if (!garment) return null;
        
        return garment.price;
    }

    async findAllGarments(): Promise<Garment[]> {
        const garments = await GarmentModel.find();
        return garments.map((garment) => ({
            id: garment._id.toString(),
            name: garment.name,
            description: garment.description,
            price: garment.price,
            color: garment.color,
            imageUrl: garment.imageUrl,
            neck: garment.neck,
            cuff: garment.cuff,
            flap: garment.flap,
            zipper: garment.zipper,
            pocket: garment.pocket,
            waist: garment.waist, 
        }));
    }
}
