import { Router } from "express";
import { controllerNotificacoes } from "../controllers/notificacoesController";

const routes = Router()

//Rotas para Notificações
routes.get('/', controllerNotificacoes.show); // Listar Notificações

export default routes