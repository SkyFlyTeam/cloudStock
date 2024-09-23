import { Request, Response } from 'express';
import { Saida } from '../models/Saida';
import { Usuario } from '../models/Usuario';
import { Lote } from '../models/Lote';
import { LoteSaida } from '../models/Lote_Saida';

export const saidaController = {
    // POST criar uma saida
    save: async (req: Request, res: Response) => {
        try {
          const { saida_valorTot, saida_dataCriacao, perfil_id, lote_ids, lote_quantidades, lote_valores } = req.body;
      
          // Verificar se o perfil_id é válido
          const usuario = await Usuario.findByPk(perfil_id);
          if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
          }
      
          // Criar a nova saída
          const novaSaida = await Saida.create({
            saida_valorTot,
            saida_dataCriacao,
            perfil_id
          });
      
          // Verificar se os lotes e suas respectivas quantidades e valores foram fornecidos
          if (lote_ids && lote_ids.length > 0 && lote_quantidades && lote_valores) {
            for (let i = 0; i < lote_ids.length; i++) {
              const lote = await Lote.findByPk(lote_ids[i]);
              if (lote) {
                // Criar as entradas na tabela Lote_Saida
                await LoteSaida.create({
                  Lote_id: lote_ids[i],
                  Saida_id: novaSaida.Saida_id,
                  Saida_quantidade: lote_quantidades[i],
                  Saida_valor: lote_valores[i]
                });
              }
            }
          }
      
          return res.status(201).json(novaSaida);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Erro ao criar saída e associar lotes', error });
        }
    },

    // GET buscar saidas cadastradas
    show: async (req: Request, res: Response) => {
        try {
          // Buscar todas as saídas e incluir as associações de usuários e lotes
          const saidas = await Saida.findAll({
            include: [
              { model: Usuario },  // Incluir os detalhes do usuário
              { model: Lote }      // Incluir os lotes associados
            ]
          });
      
          if (saidas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma saída encontrada' });
          }
      
          return res.status(200).json(saidas);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Erro ao buscar saídas', error });
        }
    }
}