import { Request, Response } from 'express';
import { Categoria } from '../models/Categoria';
import { Produto } from '../models/Produto';

export const controllerCategoria = {
  // POST /categoria
  save: async (req: Request, res: Response) => {
    // try {
    //   const categoria = await Categoria.create(req.body);
    //   return res.status(201).json(categoria);
    // } catch (error) {
    //   return res.status(400).json({ error: 'Error saving Categoria', details: error.message });
    // }
  },

  // GET /categoria
  show: async (req: Request, res: Response) => {
  //   try {
  //     const categorias = await Categoria.findAll({
  //       include: [Produto] // Incluindo produtos associados
  //     });
  //     return res.status(200).json(categorias);
  //   } catch (error) {
  //     return res.status(400).json({ error: 'Error fetching Categoria', details: error.message });
  //   }
  }
}
