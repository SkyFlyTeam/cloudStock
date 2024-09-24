import { Request, Response } from 'express';
import { Usuario } from '../models/Usuario';
import { Entrada } from '../models/Entrada';
import { Saida } from '../models/Saida';
import { Cargo } from '../models/Cargo';

export const controllerUsuario = {
  // POST /usuario
  save: async (req: Request, res: Response) => {
    try {
      const usuario = await Usuario.create(req.body);
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json({ error: 'Error saving Usuario', details: error.message });
    }
  },

  // GET /usuario
  show: async (req: Request, res: Response) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [Cargo, Entrada, Saida] // Incluindo cargos, entradas e saídas
      });
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(400).json({ error: 'Error fetching Usuario', details: error.message });
    }
  }
}
