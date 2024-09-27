import { Router } from 'express'
import {saidaController} from '../controllers/saidaController'

const router = Router();

// criar uma nova saida
router.post('/', saidaController.save)

// buscar saídas
router.get('/', saidaController.show)

export default router