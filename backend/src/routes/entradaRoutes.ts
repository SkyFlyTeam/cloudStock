import { Router } from 'express';
import { controllerEntrada } from '../controllers/entradaController'

const router = Router();

// Rota para criar uma nova entrada
router.post('/', controllerEntrada.save)

// Rota para obter todas as entradas
router.get('/', controllerEntrada.show)

export default router