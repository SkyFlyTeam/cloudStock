import { Router } from 'express';
import { controllerFornecedor } from '../controllers/fornecedorController';
const routes = Router();

// Rota para criar Fornecedor
routes.post('/', controllerFornecedor.save); // Criar fornecedor

// Rota para associar produto a fornecedor
routes.post('/fornecedor_produto', controllerFornecedor.addProdutoToFornecedor); // Criar fornecedor

routes.get('/', controllerFornecedor.show);  // Listar fornecedores

routes.delete('/:id', controllerFornecedor.delete);  // deletar fornecedores

routes.put('/:id', controllerFornecedor.update);  // update fornecedores

// Rota para mudar status do produto
routes.put('/status/:id', controllerFornecedor.changeStatus)

routes.get('/:id', controllerFornecedor.showSpecific);

export default routes;
