import { Request, Response } from 'express';
import { Setor } from '../models/Setor';
import { Local_Armazenamento } from '../models/Local_Armazenamento';

export const controllerSetor = {
  // POST /setor
  save: async (req: Request, res: Response) => {
    try {
      const usuario_id = req.headers.usuario_id?.toString();

      const setor = await Setor.create(req.body, {
        include: [Local_Armazenamento],
        context: { usuario_id: usuario_id }, // Passando o contexto para registrar o usuário
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
  },

   // GET /:id fornecedor específico
   showSpecific: async(req: Request, res: Response) => {
    const { id } = req.params
    try{
      const setor = await Setor.findByPk(id)
      if (!setor){
        return res.status(404).json({ message: 'setor encontrado' });
      }

      return res.status(200).json(setor)
    } catch(error){
      return res.status(400).json({ error: 'Erro ao buscar setor', details: error.message });
    }
  },

  // PUT /setor/:id
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const usuario_id = req.headers.usuario_id?.toString();

      const setor = await Setor.findByPk(id);
      if (!setor) {
        return res.status(404).json({ error: 'Setor não encontrado' });
      }

      await setor.update(req.body, { context: { usuario_id: usuario_id } });

      const updatedSetor = await Setor.findOne({
        where: { Setor_id: id },
        include: [Local_Armazenamento],
      });

      return res.status(200).json(updatedSetor);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar Setor', details: error.message });
    }
  },

  // PUT /status/:id 
  changeStatus: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o setor pelo ID
      const setor = await Setor.findByPk(id);
  
      if (!setor) {
        return res.status(404).json({ error: 'Setor não encontrado' });
      }
  
      // Alternar o status atual (se for true, muda para false e vice-versa)
      const novoStatus = !setor.Setor_status;
  
      // Atualizar o status no banco de dados
      await Setor.update(
        { Setor_status: novoStatus },
        { where: { Setor_id: id } }
      );
  
      // Retornar o novo status atualizado
      return res.status(200).json({ setor });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao alterar o status do setor' });
    }
  },

  // DELETE /setor/:id
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Exclui o Local_Armazenamento
      const deleted = await Setor.destroy({
        where: { Setor_id: id }
      });

      if (deleted) {
        return res.status(204).send(); // No content
      }

      return res.status(404).json({ error: 'Setor not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error deleting setor', details: error.message });
    }
  }
};
