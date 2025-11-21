import { Request, Response } from 'express';
import { GarmentRepository } from '../repositories/GarmentRepository';
import { Garment } from '@/domain/entities/Garment';

export class GarmentController {
    constructor(
        private readonly garmentRepository: GarmentRepository
    ) {}

    async createGarment(req: Request, res: Response) {
        try {
            const garmentData: Garment = req.body;

            // Validate required fields
            if (!garmentData.name || !garmentData.price ) {
                return res.status(400).json({ 
                    error: 'Missing required fields. Required: garmentName, price, sex, size' 
                });
            }

            const garment = await this.garmentRepository.saveGarment(garmentData);
            return res.status(201).json(garment);
        } catch (error) {
            console.error('Error creating garment:', error);
            return res.status(500).json({ error: 'Error creating garment' });
        }
    }

    async getGarment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const garment = await this.garmentRepository.findGarmentById(id);
            return res.status(200).json(garment);
        } catch (error) {
            console.error('Error getting garment:', error);
            return res.status(500).json({ error: 'Error getting garment' });
        }
    }

    async getAllGarments(req: Request, res: Response) {
        try {
            const garments = await this.garmentRepository.findAllGarments();
            return res.status(200).json(garments);
        } catch (error) {
            console.error('Error getting garments:', error);
            return res.status(500).json({ error: 'Error getting garments' });
        }
    }
}