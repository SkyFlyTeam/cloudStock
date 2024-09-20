import { Router } from 'express';
const loteController = require('../controllers/loteController')

const router = Router();

// rota para salvar o lote
router.post('/', loteController.save);

// rota para visualizar produto
router.get('/', loteController.show)

export default router