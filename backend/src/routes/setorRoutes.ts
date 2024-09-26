import { Router } from 'express';
import { controllerSetor } from '../controllers/setorController';
const routes = Router();

// Rota para Setor
routes.post('/', controllerSetor.save); // Criar setor
routes.get('/', controllerSetor.show);  // Listar setores
routes.get('/:id', controllerSetor.showSpecific);  // Listar setores
routes.put('/:id', controllerSetor.update); // Atualizar usuário
routes.put('/status/:id', controllerSetor.changeStatus); // Deletar usuário

export default routes;
