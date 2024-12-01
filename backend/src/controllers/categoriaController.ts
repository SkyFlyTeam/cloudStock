import { Request, Response } from 'express';
import { Categoria } from '../models/Categoria';
import { Produto } from '../models/Produto';

export const controllerCategoria = {
  // POST /categoria - Criar uma nova categoria
  save: async (req: Request, res: Response) => {
    try {
      const { Categoria_id, Categoria_nome, Categoria_status, Categoria_pai } = req.body;
      const usuario_id=req.headers.usuario_id[0]

      // Validação dos campos obrigatórios
      if (!Categoria_nome) {
        return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
      }

      const category = await Categoria.create(
        {
          Categoria_id,
          Categoria_nome,
          Categoria_status,
          Categoria_pai,
        },
        {
          include: null,
          context: { usuario_id: usuario_id }, // Passando o contexto com usuário_id
        }
      );

      return res.status(201).json(category);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // GET /categoria - Buscar todas as categorias
  show: async (req: Request, res: Response) => {
    try {
      const categories = await Categoria.findAll({
        attributes: ['Categoria_id', 'Categoria_nome', 'Categoria_status', 'Categoria_pai'],
      });

      return res.status(200).json(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // GET /categoria/:id - Buscar uma categoria específica
  showSpecific: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Verifica se o ID fornecido é válido
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const categoria = await Categoria.findByPk(id, {
        include: {
          model: Produto
        }
      });
      if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria específica', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // GET /categoria/:id - Buscar uma categoria específica
  showByPai: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      // Verifica se o ID fornecido é válido
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const categoria = await Categoria.findAll({
        include: {
          model: Produto
        },
        where: {Categoria_pai: id}
      });
      if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada' });
      }

      return res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria específica', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // PUT /categoria/:id - Atualizar categoria
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const instance = await Categoria.findByPk(id);
  
      if (!instance) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
  
      const usuario_id=req.headers.usuario_id[0]

      const updated = await instance.update(req.body, {individualHooks:true, context: { usuario_id: usuario_id }});
  
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar Categoria', details: error.message });
    }
  },
  
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      // Verifica se o ID fornecido é válido
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Busca a categoria a ser deletada para verificação de existência
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      // Verifica se a categoria possui elementos filhos
      const temFilhos = await Categoria.findOne({
        where: { Categoria_pai: id },
      });

      if (temFilhos) {
        return res.status(400).json({
          error: 'Não é possível deletar esta categoria, pois ela possui categorias dependentes.',
        });
      }

      // Deleta a categoria se não tiver filhos
      await categoria.destroy();
      return res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // PUT /status/:id 
  changeStatus: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o usuário pelo ID
      const categoria = await Categoria.findByPk(id);
  
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
  
      // Alternar o status atual (se for true, muda para false e vice-versa)
      const novoStatus = !categoria.Categoria_status;
  
      // Atualizar o status no banco de dados
      await Categoria.update(
        { Categoria_status: novoStatus },
        { where: { Categoria_id: id } }
      );
  
      // Retornar o novo status atualizado
      return res.status(200).json({ message: "Status alterado com sucesso", categoria });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao alterar o status da categoria' });
    }
  }

};