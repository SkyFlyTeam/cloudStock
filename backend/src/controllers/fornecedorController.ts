import { Request, Response } from 'express';
import { Fornecedor } from '../models/Fornecedor';
import { Produto } from '../models/Produto';
import { Fornecedor_Produto } from '../models/Fornecedor_Produto';

export const controllerFornecedor = {
  // POST /fornecedor - Criar um novo fornecedor
  save: async (req: Request, res: Response) => {
    const { Forn_nome, Forn_razaoSocial, Forn_cnpj, Forn_status, produtos } = req.body;

    try {
      // 1. Criar o Fornecedor
      const fornecedor = await Fornecedor.create({
        Forn_nome,
        Forn_razaoSocial,
        Forn_cnpj,
        Forn_status
      });

      // 2. Criar as associações na tabela Fornecedores_Produto
      if (produtos && produtos.length > 0) {
        for (const produto of produtos) {
          await Fornecedor_Produto.create({
            Forn_id: fornecedor.Forn_id,
            Prod_cod: produto.Prod_cod
          });
        }
      }

      return res.status(201).json({ message: 'Fornecedor criado com sucesso!', fornecedor });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao salvar Fornecedor', details: error.message });
    }
  },

  // POST /fornecedor/produto - Adicionar produto a um fornecedor existente
  addProdutoToFornecedor: async (req: Request, res: Response) => {
    const { Forn_id, Prod_cod } = req.body;

    try {
      // Verificar se o fornecedor existe
      const fornecedor = await Fornecedor.findByPk(Forn_id);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }

      // Verificar se o produto existe
      const produto = await Produto.findByPk(Prod_cod);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Criar a relação na tabela Fornecedor_Produto
      await Fornecedor_Produto.create({
        Forn_id,
        Prod_cod
      });

      return res.status(201).json({ message: 'Produto associado ao fornecedor com sucesso!' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao associar produto ao fornecedor', details: error.message });
    }
  },

  // GET /fornecedor - Buscar fornecedores com seus produtos
  show: async (req: Request, res: Response) => {
    try {
      const fornecedores = await Fornecedor.findAll({
        include: [Produto] // Incluindo produtos associados
      });

      if (fornecedores.length === 0) {
        return res.status(404).json({ message: 'Nenhum fornecedor encontrado' });
      }

      return res.status(200).json(fornecedores);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar fornecedores', details: error.message });
    }
  },

  showSpecific: async (req: Request, res: Response) => {
    const {id} = req.params

    try {
      const fornecedor = await Fornecedor.findByPk(id)
      if (!fornecedor) {
        return res.status(404).json({message: "Fornecedor não encontrado!"})
      }
      return res.status(200).json(fornecedor)

      
    } catch (error) {
      return res.status(400).json({error: "Erro ao buscar fornecedor"})
    }

  },

  update: async (req: Request, res: Response) => {
    const { Forn_nome, Forn_razaoSocial, Forn_cnpj, Forn_status } = req.body;

    const {id} = req.params

    try {
      // 1. Update do Fornecedor
      const [update] = await Fornecedor.update({
        Forn_nome,
        Forn_razaoSocial,
        Forn_cnpj,
        Forn_status
      },
      {where: {Forn_id: id}}
    );
    if (update) {
      const fornecedor_atualizado = await Fornecedor.findByPk(id)
      return res.status(200). json({ message: "Atualizado com sucesso!", fornecedor_atualizado })
    }
    return res.status(400).json({ message: 'Problemas com a atualização' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro de requisição', details: error.message });
    }
  },

  delete: async(req: Request, resp: Response) => {
    const {id} =  req.params
      try {
        const deleted = await Fornecedor.destroy({where: {Forn_id: id}})
        return resp.status(200).json(deleted)
      } catch (error) {
        resp.status(400).json({error: 'Erro ao deletar'})
      }
  }
};
