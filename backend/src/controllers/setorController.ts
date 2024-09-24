import { Request, Response } from 'express';
import { Setor } from '../models/Setor';
import { Local_Armazenamento } from '../models/Local_Armazenamento';

export const  controllerSetor = {
  // POST /setor
  save: async (req: Request, res: Response) => {
    try {
      const setor = await Setor.create(req.body, {
        include: [Local_Armazenamento] // Incluindo o local de armazenamento associado
      });
      return res.status(201).json(setor);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving Setor', details: error.message });
    }
  },

  // GET /setor
  show: async (req: Request, res: Response) => {
    try {
      const setores = await Setor.findAll({
        include: [Local_Armazenamento] // Incluindo os locais de armazenamento associados
      });
      return res.status(200).json(setores);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching Setores', details: error.message });
    }
  }
}
