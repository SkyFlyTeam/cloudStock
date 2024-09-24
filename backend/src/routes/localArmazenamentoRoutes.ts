import { Router } from 'express';
import { controllerLocalArmazenamento } from '../controllers/localArmazenamentoController';
const routes = Router();

// Rota para LocalArmazenamento
routes.post('/', controllerLocalArmazenamento.save); // Criar local de armazenamento
routes.get('/', controllerLocalArmazenamento.show);  // Listar locais de armazenamento

export default routes;
