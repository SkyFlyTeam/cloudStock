import { Router } from 'express';
import { controllerFornecedor } from '../controllers/fornecedorController';
const routes = Router();

// Rota para criar Fornecedor
routes.post('/', controllerFornecedor.save); // Criar fornecedor

// Rota para associar produto a fornecedor
routes.post('/fornecedor_produto', controllerFornecedor.addProdutoToFornecedor); // Criar fornecedor

routes.get('/', controllerFornecedor.show);  // Listar fornecedores

export default routes;
