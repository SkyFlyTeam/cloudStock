import { Request, Response } from 'express';
import { ConfigSistema } from '../models/ConfigSistema';

export const configController = {
  // update /configsistema
  edit: async (req: Request, res: Response) => {
    try {
      const [updated] = await ConfigSistema.update(req.body, {
        where: { Config_id: 1 }
      });
      return res.status(201).json(updated);
    } catch (error) {
      return res.status(400).json({ error: 'Error updating ConfigSistema', details: error.message });
    }
  },

  // GET /configsistema/validade
  showAvisoValidade: async (req: Request, res: Response) => {
    try {
      const Config = await ConfigSistema.findAll();
      return res.status(200).json(Config[0].Config_avisoValidade);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching Cargo', details: error.message });
    }
  }
}
