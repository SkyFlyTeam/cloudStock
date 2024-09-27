import { Request, Response } from 'express';
import { Unidade_Medida } from '../models/Unidade_Medida';
import { Produto } from '../models/Produto';

export const controllerUnidadeMedida = {
  // POST /unidadeMedida
  save: async (req: Request, res: Response) => {
    try {
      const unidadeMedida = await Unidade_Medida.create(req.body);
      return res.status(201).json(unidadeMedida);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving UnidadeMedida', details: error.message });
    }
  },

  // GET /unidadeMedida
  show: async (req: Request, res: Response) => {
    try {
      const unidadesMedida = await Unidade_Medida.findAll({
        include: [Produto] // Incluindo os produtos associados
      });
      return res.status(200).json(unidadesMedida);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching UnidadeMedida', details: error.message });
    }
  }
}
