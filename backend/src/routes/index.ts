import { Router } from 'express';

const controllerSuppliers = require('../service/controller-suppliers')
<<<<<<< HEAD
const controllerLote = require('../service/controller-lote')
=======
const controllerProducts = require('../service/produtoController')
>>>>>>> 9c1e12fd7d4beca62ef1f46c74a09f1599f06cc8

const router = Router();


// rota para salvar o fornecedor
router.post('/fornecedor', controllerSuppliers.save);
// // rota para visualizar fornecedor
router.get('/fornecedor', controllerSuppliers.show)



// rota para salvar o produto
router.post('/produto', controllerProducts.save);
// rota para visualizar produto
router.get('/produto', controllerProducts.show)

// rota para salvar o lote
router.post('/lote', controllerLote.save);
// rota para visualizar produto
router.get('//lote', controllerLote.show)

export default router;