import { Produto } from '../models/Produto';
import { Request, response, Response } from 'express';

export const controllerProducts = {
  // POST /produto - Criar um novo produto
  save: async (req, res) => {
    try {
      let { Prod_nome, Prod_preco, Prod_descricao, Prod_custo, Prod_peso, Prod_altura, Prod_largura, Prod_comprimento, Prod_marca, Prod_modelo, Prod_validade, Prod_quantidade, Categoria_id, UnidadeMedida_id } = req.body;

      let Prod_imagem = req.file ? req.file.buffer : null;

      if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }

      Prod_preco = parseFloat(Prod_preco);

      const product = await Produto.create({
        Prod_nome,
        Prod_descricao,
        Prod_preco,
        Prod_custo,
        Prod_imagem,
        Prod_peso,
        Prod_altura, 
        Prod_largura,
        Prod_comprimento, 
        Prod_marca, 
        Prod_modelo, 
        Prod_validade, 
        Prod_status: true,
        Prod_quantidade, 
        Categoria_id, 
        UnidadeMedida_id
      });
      
      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /produto - Buscar todos os produtos
  show: async (req, res) => {
    try {
      const products = await Produto.findAll({
        attributes: ['Prod_cod', 'Prod_nome', 'Prod_preco', 'Prod_status', 'Categoria_id', 'Prod_validade']
      })

      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products with suppliers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  // GET /:id fornecedor específico
  showSpecific: async(req: Request, res: Response) => {
    const { id } = req.params
    try{
      const produto = await Produto.findByPk(id)
      if (!produto){
        return res.status(404).json({ message: 'produto encontrado' });
      }

      return res.status(200).json(produto)
    } catch(error){
      return res.status(400).json({ error: 'Erro ao buscar produto', details: error.message });
    }
  },

  // GET /produto/DowloadImage/:id - Baixar imagem do produto
  showImage: async (req, res) => {
    try {
      const Prod_cod = req.params.id; 
      const produto = await Produto.findByPk(Prod_cod);

      if (!produto || !produto.Prod_imagem) {
        return res.status(404).json({ error: 'Imagem não encontrada' });
      }

      res.set('Content-Type', 'image/jpg'); 
      res.send(produto.Prod_imagem);
    } catch (error) {
      console.error('Error fetching product image:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // PUT /produto/:id - Atualizar produto
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    let { Prod_nome, Prod_preco, Prod_descricao, Prod_custo, Prod_peso, Prod_altura, Prod_largura, Prod_comprimento, Prod_marca, Prod_modelo, Prod_validade, Prod_quantidade, Prod_status, Categoria_id, UnidadeMedida_id 
    } = req.body;
      let Prod_imagem = req.file ? req.file.buffer : null;
      if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }
      Prod_preco = parseFloat(Prod_preco);
    try {
      // Validação dos campos obrigatórios
      if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }
      Prod_preco = parseFloat(Prod_preco)
      const [updated] = await Produto.update({
        Prod_nome,
        Prod_descricao,
        Prod_preco,
        Prod_custo,
        Prod_imagem,
        Prod_peso,
        Prod_altura, 
        Prod_largura,
        Prod_comprimento, 
        Prod_marca, 
        Prod_modelo, 
        Prod_validade,
        Prod_quantidade, 
        Prod_status, 
        Categoria_id, 
        UnidadeMedida_id
      }, {
        where: { Prod_cod: id }
      });
      
      if (updated) {
        const produtoAtualizado = await Produto.findOne({
          where: { Prod_cod: id }
        });
  
        return res.status(200).json(produtoAtualizado);
      }
  
      return res.status(404).json({ error: 'Produto não encontrado' });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  // PUT /status/:id 
  changeStatus: async (req, res) => {
    const { id } = req.params;
    try {
      // Procurar o produto pelo ID
      const product = await Produto.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
  
      // Alternar o status atual (se for true, muda para false e vice-versa)
      const novoStatus = !product.Prod_status;
  
      // Atualizar o status no banco de dados
      await Produto.update(
        { Prod_status: novoStatus },
        { where: { Prod_cod: id } }
      );
  
      // Retornar o novo status atualizado
      return res.status(200).json({ product });
    } catch (error) {
      console.error('Erro ao alterar o status do produto:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
  
};
