import { Router } from 'express';
import { controllerSetor } from '../controllers/setorController';
const routes = Router();

// Rota para Setor
routes.post('/', controllerSetor.save); // Criar setor
routes.get('/', controllerSetor.show);  // Listar setores

export default routes;
