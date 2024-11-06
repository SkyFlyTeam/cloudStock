import { Request, Response } from 'express';
import { Categoria } from '../models/Categoria';

export const controllerCategoria = {
  // POST /categoria - Criar uma nova categoria
  save: async (req: Request, res: Response) => {
    try {
      const { Categoria_id, Categoria_nome, Categoria_status, Categoria_pai } = req.body;

      // Validação dos campos obrigatórios
      if (!Categoria_nome) {
        return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
      }

      const category = await Categoria.create({
        Categoria_id,
        Categoria_nome,
        Categoria_status,
        Categoria_pai,
      });

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

      const categoria = await Categoria.findByPk(id);
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
    const { id } = req.params;
    const { Categoria_nome, Categoria_status, Categoria_pai } = req.body;

    try {
      // Validação do ID fornecido
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const existingCategory = await Categoria.findByPk(id);
      if (!existingCategory) {
        console.log(`Categoria com ID ${id} não encontrada para atualização.`);
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      // Atualize apenas os campos fornecidos
      const updatedCategoryData = {
        Categoria_nome: Categoria_nome ?? existingCategory.Categoria_nome,
        Categoria_status: Categoria_status ?? existingCategory.Categoria_status,
        Categoria_pai: Categoria_pai ?? existingCategory.Categoria_pai,
      };

      // Realiza a atualização e verifica se alguma linha foi afetada
      const [updated] = await Categoria.update(updatedCategoryData, {
        where: { Categoria_id: id },
      });

      if (updated) {
        const categoriaAtualizada = await Categoria.findOne({ where: { Categoria_id: id } });
        return res.status(200).json(categoriaAtualizada);
      } else {
        console.log('Nenhuma alteração foi feita na categoria.');
        return res.status(400).json({ error: 'Nenhuma alteração foi realizada.' });
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
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
};
