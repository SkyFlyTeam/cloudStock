import { Request, Response } from 'express';
import { Saida } from '../models/Saida';
import { Usuario } from '../models/Usuario';
import { Lote } from '../models/Lote';
import { Lote_Saida } from '../models/Lote_Saida';
import { Produto } from '../models/Produto';
import { Op } from 'sequelize';

export const saidaController = {
    // POST criar uma nova saida
    save: async (req: Request, res: Response) => {
        try {
            const saidasSelecionadas = req.body
            const ids = saidasSelecionadas.map((saidas: any) => saidas.idProd)
            const Usuario_id = saidasSelecionadas.map(s => s.Usuario_id)[0] 
            const produtos = await Produto.findAll({
                where: {
                    Prod_cod: {
                        [Op.in]: ids,
                    }
                }
            })

            let Saida_valorTot = 0;
            for (const produto of produtos) {
                // Verificando se há uma correspondência exata com o produto
                const saidaCorrespondente = saidasSelecionadas.find(
                    (saida) => saida.idProd === produto.Prod_cod
                );

                if (saidaCorrespondente) {
                    // Calculando o total para o produto específico
                    Saida_valorTot += produto.Prod_custo * saidaCorrespondente.quantidade;
                }
            }

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()

            const Saida_dataCriacao = `${year}-${month}-${day}`

            const novaSaida = await Saida.create({
                Saida_valorTot,
                Saida_dataCriacao,
                Usuario_id
            });

            return res.status(201).json(Saida_valorTot);
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
