import { Categoria } from '../models/Categoria';
import { Lote } from '../models/Lote';
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
        Prod_peso,
        Prod_altura, 
        Prod_largura,
        Prod_comprimento, 
        Prod_marca, 
        Prod_modelo, 
        Prod_validade, 
        Prod_status: true,
        Prod_estoqueMinimo: 0, 
        Categoria_id, 
        UnidadeMedida_id,
        Prod_imagem
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
        attributes: ['Prod_cod', 'Prod_nome', 'Prod_marca', 'Prod_modelo','Prod_preco', 'Prod_custo',  'Prod_status', 'Prod_estoqueMinimo', 'Categoria_id', 'Prod_validade'],
        include: [Lote, Categoria]
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
        return res.status(404).json({ message: 'produto não encontrado' });
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
    let {
      Prod_nome, Prod_preco, Prod_descricao, Prod_custo, Prod_peso,
      Prod_altura, Prod_largura, Prod_comprimento, Prod_marca, Prod_modelo,
      Prod_validade, Prod_status, Prod_estoqueMinimo, Categoria_id, UnidadeMedida_id 
    } = req.body;

      let Prod_imagem = req.file ? req.file.buffer : null;
      /*if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }*/
      if (Prod_preco){
        Prod_preco = parseFloat(Prod_preco);
      }

      try {
        // Verifique se o produto existe antes de tentar atualizar
        const existingProduct = await Produto.findByPk(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Apenas atualize os campos fornecidos, mantenha os outros inalterados
        const updatedProductData = {
          Prod_nome: Prod_nome || existingProduct.Prod_nome,
          Prod_descricao: Prod_descricao || existingProduct.Prod_descricao,
          Prod_preco: Prod_preco !== undefined ? Prod_preco : existingProduct.Prod_preco,
          Prod_custo: Prod_custo !== undefined ? Prod_custo : existingProduct.Prod_custo,
          Prod_peso: Prod_peso !== undefined ? Prod_peso : existingProduct.Prod_peso,
          Prod_altura: Prod_altura !== undefined ? Prod_altura : existingProduct.Prod_altura,
          Prod_largura: Prod_largura !== undefined ? Prod_largura : existingProduct.Prod_largura,
          Prod_comprimento: Prod_comprimento !== undefined ? Prod_comprimento : existingProduct.Prod_comprimento,
          Prod_marca: Prod_marca || existingProduct.Prod_marca,
          Prod_modelo: Prod_modelo || existingProduct.Prod_modelo,
          Prod_validade: Prod_validade !== undefined ? Prod_validade : existingProduct.Prod_validade,
          Prod_status: Prod_status !== undefined ? Prod_status : existingProduct.Prod_status,
          Prod_estoqueMinimo: Prod_estoqueMinimo !== undefined ? Prod_estoqueMinimo : existingProduct.Prod_estoqueMinimo,
          Categoria_id: Categoria_id !== undefined ? Categoria_id : existingProduct.Categoria_id,
          UnidadeMedida_id: UnidadeMedida_id !== undefined ? UnidadeMedida_id : existingProduct.UnidadeMedida_id,
          Prod_imagem: Prod_imagem || existingProduct.Prod_imagem
      };

         // Atualizar o produto
         const [updated] = await Produto.update(updatedProductData, {
          where: { Prod_cod: id }
      });

      if (updated) {
          const produtoAtualizado = await Produto.findOne({ where: { Prod_cod: id } });
          return res.status(200).json(produtoAtualizado);
      } else {
          return res.status(400).json({ error: "Nenhuma alteração foi realizada." });
      }
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
  },

  // 
  // delete: async(req: Request, resp: Response) => {
  //   const {id} =  req.params
  //     try {
  //       const deleted = await Produto.destroy({where: {Prod_cod: id}})
  //       return resp.status(200).json(deleted)
  //     } catch (error) {
  //       resp.status(400).json({error: 'Erro ao deletar'})
  //     }
  // }
};
