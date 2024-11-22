import { Router } from 'express';
import { controllerEstatisticas } from '../controllers/estatisticasController';

const router = Router();

router.get('/lucro', controllerEstatisticas.showLucro);
router.get('/perda', controllerEstatisticas.showPerda);

export default router;