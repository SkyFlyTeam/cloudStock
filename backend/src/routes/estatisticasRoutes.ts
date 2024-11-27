import { Router } from 'express';
import { controllerEstatisticas } from '../controllers/estatisticasController';

const router = Router();

router.get('/lucro', controllerEstatisticas.showLucro);
router.get('/perda', controllerEstatisticas.showPerda);
router.get('/maiorEntrada', controllerEstatisticas.getMaiorEntrada)
router.get('/maiorSaida', controllerEstatisticas.getMaiorSaida)
router.get('/maiorRentabilidade', controllerEstatisticas.getMaiorRentabildiade)
router.get('/maiorCusto', controllerEstatisticas.getMaiorCusto)
router.get('/valorEntrada-saida', controllerEstatisticas.getValorEntradaSaida)

export default router;