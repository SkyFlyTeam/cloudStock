import { Router } from 'express';
import { controllerEstatisticas } from '../controllers/estatisticasController';

const router = Router();

router.get('/', controllerEstatisticas.show);

export default router;