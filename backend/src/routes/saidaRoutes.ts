import { Router } from 'express'
import {saidaController} from '../controllers/saidaController'

const router = Router();

// criar uma nova saida
router.post('/', saidaController.save)

// buscar saídas
router.get('/', saidaController.show)

// buscar saídas por id
router.get('/:id', saidaController.showSpecific)

// Criar um envio em lote-saida
router.post('/lote-saida', saidaController.addLoteToSaida)

export default router