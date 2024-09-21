import { Router } from 'express';
import multer from 'multer';
const produtoController = require('../controllers/produtoController')

const router = Router();

// Configure multer to store the uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para criar uma nova entrada
router.post('/', upload.single('prod_imagem'), produtoController.save)

// Rota para obter todas as entradas
router.get('/', produtoController.show)

// Rota para exibir a imagem de cada produto
router.get('/DownloadImage/:id', produtoController.showImage)

export default router