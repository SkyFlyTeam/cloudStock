import { Router } from 'express';
import entradaRoutes from './entradaRoutes'
import produtoRoutes from './produtoRoutes';
import loteRoutes from './loteRoutes';
import saidaRoutes from './saidaRoutes'

const router = Router();

router.use('/entrada', entradaRoutes)
router.use('/produto', produtoRoutes)
router.use('/lote', loteRoutes)
router.use('/saida', saidaRoutes)

export default router;