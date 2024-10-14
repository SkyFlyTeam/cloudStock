import { Request, Response } from 'express';
import { Registros } from '../models/Registros';

export const controllerRegistros = {
    // GET registros
    show: async (req: Request, res: Response) => {
        try {
            const registros = await Registros.findAll();

            return res.status(200).json(registros);
        }
        
        catch (error) {
            return res.status(400).json({ error: 'Error fetching Registros', details: error.message });
          }
    }
}