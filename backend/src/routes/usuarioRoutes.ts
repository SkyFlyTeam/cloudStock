import { Router } from 'express';
import { controllerUsuario } from '../controllers/usuarioController';
const routes = Router();

// Rota para Usuario
routes.post('/', controllerUsuario.save); // Criar cargo
routes.get('/', controllerUsuario.show);  // Listar cargos
routes.get('/:id', controllerUsuario.showSpecific);  // Listar cargos
routes.put('/:id', controllerUsuario.update); // Atualizar usuário
routes.put('/status/:id', controllerUsuario.changeStatus); // Atualiza status do usuário
routes.put('/cargo/:id', controllerUsuario.changeCargo); // Atualiza cargo do usuário

export default routes