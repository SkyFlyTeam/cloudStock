import { Produto } from '../models/Produto';

const controllerProducts = {
  // POST /produto
  save: async (req, res) => {
    try {
      let { prod_cod, prod_nome, prod_preco } = req.body;

      let prod_imagem = req.file ? req.file.buffer : null;

      if (!prod_cod || !prod_nome || !prod_preco) {
        return res.status(400).json({ error: "Missing required fields: id, name, price" });
      }

      prod_preco = parseFloat(prod_preco)

      const product = await Produto.create({
        prod_cod,
        prod_nome,
        prod_preco,
        prod_imagem
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
        attributes: ['prod_cod', 'prod_nome', 'prod_preco', 'prod_status', 'categoria', 'prod_validade']
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
      const prod_cod = req.params.id; 
      const produto =  await Produto.findByPk(prod_cod);

      res.set('Content-Type', 'image/jpg'); 
      res.send(produto.prod_imagem);
    } catch (error) {
      console.error('Error fetching products with suppliers:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

module.exports = controllerProducts