import {Router} from 'express';
import { controllerLoteEntrada } from '../controllers/loteEntradaController';
const router = Router();

//rota para visualizar a entrada do produto
router.get('/', controllerLoteEntrada.show)

export default router