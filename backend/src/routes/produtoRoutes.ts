import { Router } from 'express';
import multer from 'multer';
import {controllerProducts} from '../controllers/produtoController'

const router = Router();

// Configure multer to store the uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para criar uma nova entrada
router.post('/', upload.single('Prod_imagem'), controllerProducts.save)

// Rota para obter todas as entradas
router.get('/', controllerProducts.show)

// Rota para exibir a imagem de cada produto
router.get('/DownloadImage/:id', controllerProducts.showImage)

export default router