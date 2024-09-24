import { Router } from 'express';
import { controllerUnidadeMedida } from '../controllers/unidadeMedidaController';
const routes = Router();

// Rota para UnidadeMedida
routes.post('/', controllerUnidadeMedida.save); // Criar unidade de medida
routes.get('/', controllerUnidadeMedida.show);  // Listar unidades de medida

export default routes;
