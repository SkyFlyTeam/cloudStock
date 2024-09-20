import { Router } from 'express';
const produtoController = require('../controllers/produtoController')

const router = Router();

// Rota para criar uma nova entrada
router.post('/', produtoController.save)

// Rota para obter todas as entradas
router.get('/', produtoController.show)

export default router