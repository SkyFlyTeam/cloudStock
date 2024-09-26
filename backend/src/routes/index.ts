import { Router } from 'express';
import entradaRoutes from './entradaRoutes'
import produtoRoutes from './produtoRoutes';
import loteRoutes from './loteRoutes';

const router = Router();

// router.use('/entrada', entradaRoutes)
router.use('/produto', produtoRoutes)
// router.use('/lote', loteRoutes)

export default router;