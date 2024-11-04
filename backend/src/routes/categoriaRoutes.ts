import { Router } from 'express';
import { controllerCategoria } from '../controllers/categoriaController'
const routes = Router();

// Rota para Categoria
routes.post('/', controllerCategoria.save); // Criar categoria

routes.get('/', controllerCategoria.show);  // Listar categorias

routes.get('/:id', controllerCategoria.show); // Listar categorias com pai de id = ?

routes.put('/', controllerCategoria.save); // Editar uma categoria

routes.put('/status/:id', controllerCategoria.show); // Rota para mudar status do produto

export default routes;
