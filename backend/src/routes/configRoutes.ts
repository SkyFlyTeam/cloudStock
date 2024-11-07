import { Router } from 'express';
import { configController } from '../controllers/configController';
const routes = Router();

// Rota para Cargo
routes.put('/', configController.edit); // Editar Configuração

routes.get('/validade', configController.showAvisoValidade);  // Listar AvisoValidade

export default routes