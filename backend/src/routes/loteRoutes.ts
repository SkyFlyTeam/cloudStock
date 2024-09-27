import { Router } from 'express';
import {controllerLote} from '../controllers/loteController'
import { controllerEntrada } from '../controllers/entradaController';
import { saidaController } from '../controllers/saidaController';

const router = Router();

// rota para salvar o lote
router.post('/', controllerLote.save);

// rota para visualizar produto
router.get('/', controllerLote.show)

// Rota para associar lote a entrada
router.post('/lote-entrada', controllerEntrada.addLoteToEntrada)

// Associar lote a saida
router.post('/lote-saida', saidaController.addLoteToSaida)

export default router