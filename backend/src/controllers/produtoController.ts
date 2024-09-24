import { Produto } from '../models/Produto';

const controllerProducts = {
  // POST /produto
  save: async (req, res) => {
    try {
      let { Prod_nome, Prod_preco } = req.body;

      let Prod_imagem = req.file ? req.file.buffer : null;

      if (!Prod_nome || !Prod_preco) {
        return res.status(400).json({ error: "Campos faltando: Nome, preço" });
      }

      Prod_preco = parseFloat(Prod_preco)

      const product = await Produto.create({
        Prod_cod: 1,
        Prod_nome,
        Prod_preco,
        Prod_imagem
      }, {
        fields: ['Prod_nome', 'Prod_preco', 'Prod_imagem']
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
      const products = await Produto.findAll({
        attributes: ['Prod_cod', 'Prod_nome', 'Prod_preco']
      })

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

module.exports = controllerProducts