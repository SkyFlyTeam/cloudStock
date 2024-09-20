import { Product } from '../models/Product';
import { Supplier } from '../models/Supplier';

const controllerProducts = {
  // POST /produto
  save: async (req, res) => {
    try {
      const { name, price, supplierId } = req.body;
      if (!name || !price || !supplierId) {
        return res.status(400).json({ error: "All fields are required: name, price, supplierId" });
      }
      const product = await Product.create({
        name,
        price,
        supplierId,
      });
      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  // GET /produto
  show: async (req, res) => {
    try {
      // Busca todos os produtos com seus fornecedores relacionados
      const products = await Product.findAll({
        include: [Supplier],  // Incluir os fornecedores relacionados
      });

      // Retorna os produtos com seus fornecedores
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products with suppliers:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = controllerProducts