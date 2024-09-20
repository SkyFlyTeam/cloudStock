import { Router } from 'express';

const controllerSuppliers = require('../service/controller-suppliers')
const controllerProducts = require('../service/produtoController')

const router = Router();


// rota para salvar o fornecedor
router.post('/fornecedor', controllerSuppliers.save);
// // rota para visualizar fornecedor
router.get('/fornecedor', controllerSuppliers.show)



// rota para salvar o produto
router.post('/produto', controllerProducts.save);
// rota para visualizar produto
router.get('/produto', controllerProducts.show)

export default router;