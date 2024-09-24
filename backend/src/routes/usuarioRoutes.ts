import { Router } from 'express';
import { controllerUsuario } from '../controllers/usuarioController';
const routes = Router();

// Rota para Usuario
routes.post('/', controllerUsuario.save); // Criar cargo
routes.get('/', controllerUsuario.show);  // Listar cargos

export default routes