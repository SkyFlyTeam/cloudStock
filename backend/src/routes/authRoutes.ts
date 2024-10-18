import { Router } from 'express';
import { controllerAuth } from '../controllers/authController';

const routes = Router();

// Rota para Autenticação
routes.post('/', controllerAuth.checkLogin); // Logar usuário 

export default routes