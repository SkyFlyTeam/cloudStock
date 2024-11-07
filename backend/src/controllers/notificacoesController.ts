import { Request, Response } from 'express';
import { Notificacoes } from '../models/Notificacoes';
import { Lote } from '../models/Lote';
import { Produto } from '../models/Produto';

export const controllerNotificacoes = {
    // GET Notificações
    show: async (req: Request, res: Response) => {
        try {
            const notificacoes = await Notificacoes.findAll({include: [Lote, Produto]});

            return res.status(200).json(notificacoes);
        }
        
        catch (error) {
            return res.status(400).json({ error: 'Error fetching Notificações', details: error.message });
          }
    },

    delete: async(req: Request, resp: Response) => {
        const {id} =  req.params
        try {
            const deleted = await Notificacoes.destroy({where: {Not_id: id}})
            return resp.status(200).json(deleted)
        } catch (error) {
            resp.status(400).json({error: 'Erro ao deletar'})
        }
    }
}