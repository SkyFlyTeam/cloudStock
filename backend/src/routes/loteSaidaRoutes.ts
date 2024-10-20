import { Router } from "express";
import { controllerLoteSaida } from "../controllers/loteSaidaController";

const router = Router();

//rota para visualizar saida do lote

router.get('/', controllerLoteSaida.show)

export default router