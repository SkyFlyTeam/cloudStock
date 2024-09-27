import { Router } from 'express';
import { controllerCargo } from '../controllers/cargoController';
const routes = Router();

// Rota para Cargo
routes.post('/', controllerCargo.save); // Criar cargo
routes.get('/', controllerCargo.show);  // Listar cargos

export default routes