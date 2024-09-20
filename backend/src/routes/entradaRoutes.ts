import { Router } from 'express';
const entradaController = require('../controllers/entradaController')

const router = Router();

// Rota para criar uma nova entrada
router.post('/', entradaController.save)

// Rota para obter todas as entradas
router.get('/', entradaController.show)

export default router