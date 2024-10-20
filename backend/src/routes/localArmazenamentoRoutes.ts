import { Router } from 'express';
import { controllerLocalArmazenamento } from '../controllers/localArmazenamentoController';
const routes = Router();

//  Criar local de armazenamento
routes.post('/', controllerLocalArmazenamento.save)

// Listar locais de armazenamento
routes.get('/', controllerLocalArmazenamento.show);  

// Local específico
routes.get('/:id', controllerLocalArmazenamento.showSpecific);  

// Local por setor
routes.get('/setor/:id', controllerLocalArmazenamento.showBySetor)

// Atualizar LocalArmazenamento
routes.put('/:id', controllerLocalArmazenamento.update); 

// Deletar LocalArmazenamento
routes.delete('/:id', controllerLocalArmazenamento.delete); 

export default routes;
