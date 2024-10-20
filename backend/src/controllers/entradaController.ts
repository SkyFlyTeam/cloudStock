import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada'; // Importando o modelo Entrada
import { Lote } from '../models/Lote'; // Importando o modelo Lote
import { Usuario } from '../models/Usuario'; // Importando o modelo Usuario
import { Lote_Entrada } from '../models/Lote_Entrada'; // Importando a tabela de junção
import { Produto } from '../models/Produto'; // Importando a tabela de junção
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Fornecedor } from '../models/Fornecedor';

export const controllerEntrada = {
    // POST /entrada - Criar uma nova entrada
    save: async (req: Request, res: Response) => {
        try {
            const { Ent_valortot, Ent_dataCriacao, Usuario_id, lotes } = req.body;

            // Verifica se o usuário existe
            const usuario = await Usuario.findByPk(Usuario_id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Cria a entrada
            const novaEntrada = await Entrada.create({
                Ent_valortot,
                Ent_dataCriacao,
                Usuario_id,
            });

            // Verifica se os lotes existem e associa à nova entrada
            if (lotes && lotes.length > 0) {
                for (const { loteId, Ent_quantidade, Ent_valor } of lotes) {
                    const lote = await Lote.findByPk(loteId);
                    if (!lote) {
                        return res.status(404).json({ error: `Lote com ID ${loteId} não encontrado` });
                    }

                    // Cria a relação na tabela Lote_Entrada
                    await Lote_Entrada.create({
                        Lote_id: loteId,
                        Ent_id: novaEntrada.Ent_id,
                        Ent_quantidade: Ent_quantidade || lote.Lote_quantidade, // Se não especificado, usar a quantidade do lote
                        Ent_valor: Ent_valor
                    });
                }
            }

            res.status(201).json({ message: 'Entrada criada com sucesso', entrada: novaEntrada });
        } catch (error) {
            console.error('Erro ao criar entrada:', error);
            res.status(500).json({ error: 'Erro ao criar entrada' });
        }
    },

    // POST /entrada_lote - Associar lote a uma entrada existente
    addLoteToEntrada: async (req: Request, res: Response) => {
        try {
            const { Lote_id, Ent_id, Ent_quantidade, Ent_valor } = req.body;

            // Verifica se a entrada já existe
            const entrada = await Entrada.findByPk(Ent_id);
            if (!entrada) {
                return res.status(404).json({ error: 'Entrada não encontrada' });
            }

            // Verifica se o lote já existe
            const lote = await Lote.findByPk(Lote_id);
            if (!lote) {
                return res.status(404).json({ error: 'Lote não encontrado' });
            }

            // Cria a relação na tabela Lote_Entrada
            const loteEntrada = await Lote_Entrada.create({
                Lote_id: Lote_id,
                Ent_id: Ent_id,
                Ent_quantidade: Ent_quantidade || lote.Lote_quantidade, // Se não for especificada, usar a quantidade do lote
                Ent_valor: Ent_valor || 0 // Define valor padrão se não especificado
            });

            res.status(201).json({ message: 'Lote associado à entrada com sucesso', loteEntrada });
        } catch (error) {
            console.error('Erro ao associar lote à entrada:', error);
            res.status(500).json({ error: 'Erro ao associar lote à entrada' });
        }
    },

    // GET /entrada - Mostrar todas as entradas
    show: async (req: Request, res: Response) => {
        try {
            // Recupera todas as entradas, incluindo as associações com Lotes e a tabela de junção LoteEntrada
            const entradas = await Entrada.findAll({
                include: [{
                    model: Lote,
                    through: {}
                }],
            });

            // Se não houver entradas, retorna uma resposta apropriada
            if (!entradas || entradas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma entrada encontrada' });
            }

            // Retorna as entradas encontradas
            res.status(200).json(entradas);
        } catch (error) {
            console.error('Erro ao recuperar as entradas:', error);
            res.status(500).json({ error: 'Erro ao recuperar as entradas' });
        }
    },

    // GET /entrada - Mostrar entradas por Id
    showSpecific: async (req: Request, res: Response) => {
        const {id} = req.params

        try {
            // Recupera todas as entradas, incluindo as associações com Lotes e a tabela de junção LoteEntrada
            const entrada = await Entrada.findByPk(id, {
                include: [
                    {
                      model: Lote,
                      include: [
                        {
                          model: Produto,
                          include: [
                            { model: Fornecedor } // Inclui os fornecedores do produto
                          ]
                        },
                        {
                          model: Local_Armazenamento // Inclui os locais de armazenamento do lote
                        }
                      ]
                    },
                    {
                        model: Usuario,
                    }
                  ]
            });

            // Se não houver entradas, retorna uma resposta apropriada
            if (!entrada) {
                return res.status(404).json({ message: 'Nenhuma entrada encontrada' });
            }

            // Retorna as entradas encontradas
            res.status(200).json(entrada);
        } catch (error) {
            console.error('Erro ao recuperar as entradas:', error);
            res.status(500).json({ error: 'Erro ao recuperar as entradas' });
        }
    },

};
