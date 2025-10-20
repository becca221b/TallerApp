import { GarmentService } from '@/domain/services/garment-service';
import { Garment } from '@/domain/entities/Garment';
import { GarmentModel } from '../models/GarmentModel';

export class GarmentRepository implements GarmentService {
    async saveGarment(garment: Garment): Promise<Garment> {
        const garmentDoc = new GarmentModel(garment);
        const savedGarment = await garmentDoc.save();
        return savedGarment.toJSON() as Garment;
    }

    async findGarmentById(id: string): Promise<Garment | null> {
        const garment = await GarmentModel.findOne({ id }).exec();
        return garment ? garment.toJSON() as Garment : null;
    }

    async findGarmentPriceById(id: string): Promise<number | null> {
        const garment = await GarmentModel.findOne({ id }).select('price').exec();
        return garment ? garment.price : null;
    }

    
}