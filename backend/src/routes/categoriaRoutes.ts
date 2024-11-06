import { Router } from 'express';
import { controllerCategoria } from '../controllers/categoriaController';

const routes = Router();

// Rota para criar uma nova categoria
routes.post('/', controllerCategoria.save);

// Rota para listar todas as categorias
routes.get('/', controllerCategoria.show);

// Rota para listar uma categoria específica pelo ID
routes.get('/:id', controllerCategoria.showSpecific);

// Rota para atualizar uma categoria pelo ID
routes.put('/:id', controllerCategoria.update);

routes.delete('/:id', controllerCategoria.delete);

export default routes;
