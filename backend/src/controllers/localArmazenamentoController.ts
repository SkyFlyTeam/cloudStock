import { Request, Response } from 'express';
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Setor } from '../models/Setor';
import { Lote } from '../models/Lote';

export const controllerLocalArmazenamento = {
  // POST /localArmazenamento
  save: async (req: Request, res: Response) => {
    try {
      const localArmazenamento = await Local_Armazenamento.create(req.body, {
        include: [Setor] // Incluindo o setor associado
      });
      return res.status(201).json(localArmazenamento);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving LocalArmazenamento', details: error.message });
    }
  },

  // GET /localArmazenamento
  show: async (req: Request, res: Response) => {
    try {
      const locaisArmazenamento = await Local_Armazenamento.findAll({
        include: [Setor, Lote] // Incluindo as relações com setor e lote
      });
      return res.status(200).json(locaisArmazenamento);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching LocalArmazenamento', details: error.message });
    }
  }
}
