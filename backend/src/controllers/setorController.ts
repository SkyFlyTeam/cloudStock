import { Request, Response } from 'express';
import { Setor } from '../models/Setor';
import { Local_Armazenamento } from '../models/Local_Armazenamento';

export const controllerSetor = {
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
  
      // Atualiza apenas os dados do Setor
      const [updated] = await Setor.update(req.body, {
        where: { Setor_id: id }
      });
  
      if (updated) {
        // Atualiza os dados de Local_Armazenamento separadamente se eles existirem no body
        if (req.body.Local_Armazenamento) {
          const local = await Local_Armazenamento.findOne({ where: { Setor_id: id } });
  
          if (local) {
            await Local_Armazenamento.update(req.body.Local_Armazenamento, {
              where: { Setor_id: id }
            });
          } else {
            // Caso não exista, cria o Local_Armazenamento
            await Local_Armazenamento.create({
              ...req.body.Local_Armazenamento,
              Setor_id: id
            });
          }
        }
  
        // Retorna o setor atualizado
        const updatedSetor = await Setor.findOne({
          where: { Setor_id: id },
          include: [Local_Armazenamento] // Inclui os dados atualizados de Local_Armazenamento
        });
        return res.status(200).json(updatedSetor);
      }
  
      return res.status(404).json({ error: 'Setor not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error updating Setor', details: error.message });
    }
  }
  ,

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
  }
};
