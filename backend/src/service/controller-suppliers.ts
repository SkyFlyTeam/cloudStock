import { Product } from '../models/Product';
import { Supplier } from '../models/Supplier';

const controllerSuppliers = {
  // POST /fornecedor
  save: async (req, res) => {
    try {
      const { name, contactInfo } = req.body;

      // Verifica se o nome foi fornecido
      if (!name) {
        return res.status(400).json({ error: 'Supplier name is required' });
      }

      // Cria um novo fornecedor
      const supplier = await Supplier.create({
        name,
        contactInfo
      });

      // Retorna o fornecedor criado como resposta
      return res.status(201).json(supplier);
    } catch (error) {
      console.error('Error creating supplier:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /fornecedor
  show: async (req, res) => {
    try {
        // Busca todos os fornecedores com os produtos relacionados
        const suppliers = await Supplier.findAll({
          include: [Product],  // Incluir os produtos relacionados
        });
  
        // Retorna os fornecedores com os produtos
        return res.status(200).json(suppliers);
      } catch (error) {
        console.error('Error fetching suppliers with products:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  }
};

module.exports = controllerSuppliers