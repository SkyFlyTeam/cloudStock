import { Router } from 'express';
import { controllerCategoria } from '../controllers/categoriaController'
const routes = Router();

// Rota para Categoria
routes.post('/', controllerCategoria.save); // Criar categoria
routes.get('/', controllerCategoria.show);  // Listar categorias

export default routes;
