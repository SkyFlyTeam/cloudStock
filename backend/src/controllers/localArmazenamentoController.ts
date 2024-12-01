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
  },

  // GET /localArmazenamento/:id
  showSpecific: async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      const local = await Local_Armazenamento.findByPk(id)
      if (!local) {
        return res.status(404).json({ message: 'local não encontrado' });
      }

      return res.status(200).json(local)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar local', details: error.message });
    }
  },

  showBySetor: async (req: Request, res: Response) => {
    const id = req.params.id
    try {
      const locais = await Local_Armazenamento.findAll({
        where: {
          Setor_id: id
        },
      })
      console.log(locais)
      if (!locais) {
        return res.status(404).json({ message: 'local não encontrado' });
      }
      res.status(200).json(locais)
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar local', details: error.message });
    }
  },

  // PUT /localArmazenamento/:id
  update: async (req: Request, res: Response) => {
    try {

      const { id } = req.params;

      // Atualiza apenas os dados do Local_Armazenamento
      const instance = await Local_Armazenamento.findOne({ where: { LocAr_id: id } });
      if (!instance) {
        return res.status(404).json({ error: 'Local Armazenamento não encontrado' });
      }
      const updated = await instance.update(req.body);

      if (updated) {
        // Atualiza as relações com Setor se for necessário
        if (req.body.Setor) {
          await Setor.update(req.body.Setor, {
            where: { Setor_id: req.body.Setor_id } // Atualiza o setor relacionado
          });
        }

        // Retorna o local de armazenamento atualizado com Setor e Lote incluídos
        const updatedLocalArmazenamento = await Local_Armazenamento.findOne({
          where: { LocAr_id: id },
          include: [Setor, Lote]
        });

        return res.status(200).json(updatedLocalArmazenamento);
      }

      return res.status(404).json({ error: 'LocalArmazenamento not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error updating LocalArmazenamento', details: error.message });
    }
  },

  // DELETE /localArmazenamento/:id
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Exclui o Local_Armazenamento
      const deleted = await Local_Armazenamento.destroy({
        where: { LocAr_id: id }
      });

      if (deleted) {
        return res.status(204).send(); // No content
      }

      return res.status(404).json({ error: 'LocalArmazenamento not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error deleting LocalArmazenamento', details: error.message });
    }
  }
};
