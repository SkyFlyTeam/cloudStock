import { Produto } from '../models/Produto';

export const controllerProducts = {
  // POST /produto
  save: async (req, res) => {
    try {
      let { Prod_nome, Prod_preco, Prod_descricao , Prod_custo, Prod_peso, Prod_altura, Prod_largura, Prod_comprimento, Prod_marca, Prod_modelo, Prod_validade, Categoria_id, UnidadeMedida_id} = req.body;

      let Prod_imagem = req.file ? req.file.buffer : null;

      if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }

      Prod_preco = parseFloat(Prod_preco)

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
        Categoria_id, 
        UnidadeMedida_id
      })
      return res.status(201).json(product)
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  // GET /produto
  show: async (req, res) => {
    try {
      const products = await Produto.findAll()

      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products with suppliers:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
  // GET /produto/DowloadImage/:id
  showImage: async (req, res) => {
    try {
      const Prod_cod = req.params.id; 
      const produto =  await Produto.findByPk(Prod_cod);

      res.set('Content-Type', 'image/jpg'); 
      res.send(produto.Prod_imagem);
    } catch (error) {
      console.error('Error fetching products with suppliers:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}