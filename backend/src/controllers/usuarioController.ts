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
  },

   // GET /:id usuario específico
   showSpecific: async(req: Request, res: Response) => {
    const { id } = req.params
    try{
      const usuario = await Usuario.findByPk(id, {
        include: [Cargo, Entrada, Saida]
      })
      if (!usuario){
        return res.status(404).json({ message: 'usuario encontrado' });
      }

      return res.status(200).json(usuario)
    } catch(error){
      return res.status(400).json({ error: 'Erro ao buscar usuario', details: error.message });
    }
  },

  // PUT /usuario/:id
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
      }
      const [updated] = await Usuario.update(req.body, {
        where: { Usuario_id: id }
      });
      if (updated) {
        const updatedUsuario = await Usuario.findOne({ where: { Usuario_id: id } });
        return res.status(200).json(updatedUsuario);
      }
      return res.status(404).json({ error: 'Usuario not found' });
    } catch (error) {
      return res.status(400).json({ error: 'Error updating Usuario', details: error.message });
    }
  },

  // PUT /status/:id 
  changeStatus: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o usuário pelo ID
      const usuario = await Usuario.findByPk(id);
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Alternar o status atual (se for true, muda para false e vice-versa)
      const novoStatus = !usuario.Usuario_status;
  
      // Atualizar o status no banco de dados
      await Usuario.update(
        { Usuario_status: novoStatus },
        { where: { Usuario_id: id } }
      );
  
      // Retornar o novo status atualizado
      return res.status(200).json({ message: "Status alterado com sucesso", usuario });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao alterar o status do usuário' });
    }
  }
}
