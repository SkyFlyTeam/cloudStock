import { Router } from 'express';
import {controllerLote} from '../controllers/loteController'
import { controllerEntrada } from '../controllers/entradaController';
import { saidaController } from '../controllers/saidaController';

const router = Router();

// rota para salvar o lote
router.post('/', controllerLote.save);

// rota para visualizar produto
router.get('/', controllerLote.show)

// Rota para visualizar a quantidade total de um produto
router.get('/quantidade/:id', controllerLote.showQuantidade)

// Rota para visualizar a quantidade total de um produto
router.get('/produto/:id', controllerLote.showByProdId)

// Associar lote a saida
router.post('/lote-saida', saidaController.addLoteToSaida)

// Lote por local
router.get('/local/:id', controllerLote.showByLocal)

export default router