import { Request, Response } from 'express';
import { Cargo } from '../models/Cargo';
import { Usuario } from '../models/Usuario';

export const controllerCargo = {
  // POST /cargo
  save: async (req: Request, res: Response) => {
    try {
      const cargo = await Cargo.create(req.body);
      return res.status(201).json(cargo);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving Cargo', details: error.message });
    }
  },

  // GET /cargo
  show: async (req: Request, res: Response) => {
    try {
      const cargos = await Cargo.findAll({
        include: [Usuario] // Incluindo os usuários associados ao cargo
      });
      return res.status(200).json(cargos);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching Cargo', details: error.message });
    }
  }
}
