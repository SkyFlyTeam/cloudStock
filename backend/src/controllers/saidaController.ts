import { Request, Response } from 'express';
import { Saida } from '../models/Saida';
import { Usuario } from '../models/Usuario';
import { Lote } from '../models/Lote';
import { Lote_Saida } from '../models/Lote_Saida';

export const saidaController = {
    // POST criar uma nova saida
    save: async (req: Request, res: Response) => {
        try {
            const { Saida_valorTot, Saida_dataCriacao, Usuario_id, lote_ids, lote_quantidades, lote_valores } = req.body;

            // Verificar se o usuário_id é válido
            const usuario = await Usuario.findByPk(Usuario_id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Criar a nova saída
            const novaSaida = await Saida.create({
                Saida_valorTot,
                Saida_dataCriacao,
                Usuario_id
            });

            // Verificar se os lotes e suas respectivas quantidades e valores foram fornecidos
            if (lote_ids && lote_ids.length > 0 && lote_quantidades && lote_valores) {
                for (let i = 0; i < lote_ids.length; i++) {
                    const lote = await Lote.findByPk(lote_ids[i]);
                    if (lote) {
                        // Criar as entradas na tabela Lote_Saida
                        await Lote_Saida.create({
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

    // POST adicionar lote a uma saída existente
    addLoteToSaida: async (req: Request, res: Response) => {
        try {
            const { Lote_id, Saida_id, Saida_quantidade, Saida_valor } = req.body;

            // Verificar se a saída já existe
            const saida = await Saida.findByPk(Saida_id);
            if (!saida) {
                return res.status(404).json({ message: 'Saída não encontrada' });
            }

            // Verificar se o lote já existe
            const lote = await Lote.findByPk(Lote_id);
            if (!lote) {
                return res.status(404).json({ message: 'Lote não encontrado' });
            }

            // Criar a relação na tabela Lote_Saida
            const loteSaida = await Lote_Saida.create({
                Lote_id,
                Saida_id,
                Saida_quantidade,
                Saida_valor
            });

            return res.status(201).json({ message: 'Lote associado à saída com sucesso', loteSaida });
        } catch (error) {
            console.error('Erro ao associar lote à saída:', error);
            return res.status(500).json({ message: 'Erro ao associar lote à saída' });
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
