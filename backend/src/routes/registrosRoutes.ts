import { Router } from "express";
import { controllerRegistros } from "../controllers/registrosController";


const routes = Router()

//Rotas para Registros
routes.get('/', controllerRegistros.show); // Listar Registros

export default routes