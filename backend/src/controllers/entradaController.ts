import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada'; // Importando o modelo Entrada
import { Lote } from '../models/Lote'; // Importando o modelo Lote
import { Usuario } from '../models/Usuario'; // Importando o modelo Usuario
import { Lote_Entrada } from '../models/Lote_Entrada'; // Importando a tabela de junção
import { Produto } from '../models/Produto'; // Importando a tabela de junção
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Fornecedor } from '../models/Fornecedor';

import { Produto } from '../models/Produto'; // Importando a tabela de junção
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Fornecedor } from '../models/Fornecedor';
import { Op } from 'sequelize';


export const controllerEntrada = {
    // POST /entrada - Criar uma nova entrada
    save: async (req: Request, res: Response) => {
        const transaction = await Entrada.sequelize?.transaction();
        try {
            const entradasSelecionadas = req.body;
            const ids = entradasSelecionadas.map((entrada: any) => entrada.Prod_cod);
            const Usuario_id = entradasSelecionadas[0]?.Usuario_id;
    
            // Recuperar os produtos envolvidos na entrada
            const produtos = await Produto.findAll({
                where: {
                    Prod_cod: {
                        [Op.in]: ids,
                    }
                },
                transaction
            });
    
            // Criar uma nova entrada
            const entradaEnvio = await Entrada.create({
                Ent_valortot: 0,
                Ent_dataCriacao: new Date(),
                Usuario_id: Usuario_id
            }, { transaction });
    
            let valorTotal = 0;
    
            for (const entrada of entradasSelecionadas) {
                console.log('Entrada Lote_quantidade:', entrada.Lote_quantidade);
    
                if (!entrada.Lote_quantidade || isNaN(entrada.Lote_quantidade)) {
                    throw new Error('Lote_quantidade is missing or invalid');
                }
    
                const produtoCorrespondente = produtos.find(p => p.Prod_cod === entrada.Prod_cod);
                if (produtoCorrespondente) {
                    valorTotal += (produtoCorrespondente.Prod_custo * entrada.Lote_quantidade);
    
                    // Verifica se o lote já existe
                    let lote = await Lote.findOne({
                        where: { Lote_cod: entrada.Lote_cod },
                        transaction
                    });
    
                    let loteId;
                    if (lote) {
                        // Atualiza a quantidade do lote existente
                        const novaQuantidade = lote.Lote_quantidade + entrada.Lote_quantidade;
                        await Lote.update(
                            { Lote_quantidade: novaQuantidade },
                            { where: { Lote_cod: entrada.Lote_cod }, transaction }
                        );
                        loteId = lote.Lote_id;
                    } else {
                        // Cria um novo lote
                        const newLote = await Lote.create({
                            Lote_validade: entrada.Lote_validade,
                            Lote_quantidade: entrada.Lote_quantidade,
                            Lote_cod: entrada.Lote_cod,
                            Prod_cod: entrada.Prod_cod,
                            LocAr_id: entrada.LocAr_id
                        }, { transaction });
                        loteId = newLote.Lote_id;
                    }
    
                    // Cria uma nova associação de lote e entrada
                    const envio = {
                        Lote_id: loteId,
                        Ent_id: entradaEnvio.Ent_id,
                        Ent_quantidade: entrada.Lote_quantidade,
                        Ent_valor: (produtoCorrespondente.Prod_custo * entrada.Lote_quantidade)
                    };
    
                    await controllerEntrada.addLoteToEntradaFunc(envio, transaction);
    
                    console.log('Envio:', envio);
    
                    // // Atualiza a quantidade do produto
                    // const novaQuantidadeProduto = produtoCorrespondente.Prod_quantidade + entrada.Lote_quantidade;
                    // await Produto.update(
                    //     { Prod_quantidade: novaQuantidadeProduto },
                    //     { where: { Prod_cod: entrada.Prod_cod }, transaction }
                    // );
                }
            }
    
            // Atualiza o valor total da entrada
            entradaEnvio.Ent_valortot = valorTotal;
            await entradaEnvio.save({ transaction });
    
            // Finaliza a transação
            await transaction?.commit();
    
            res.status(201).json({ message: 'Entrada criada com sucesso', entradaEnvio });
        } catch (error) {
            console.error('Error in creating entry:', error);
            await transaction?.rollback();
            res.status(500).json({ error: 'Error in creating entry' });
        }
    },

    // Função para associar o lote à entrada
    addLoteToEntradaFunc: async (envio: any, transaction: any) => {
        try {
            const { Lote_id, Ent_id, Ent_quantidade, Ent_valor } = envio;
    
            // Verificar se já existe a combinação de Lote_id e Ent_id
            const loteEntradaExistente = await Lote_Entrada.findOne({
                where: {
                    Lote_id,
                    Ent_id
                },
                transaction
            });
    
            if (!loteEntradaExistente) {
                // Se não existe, cria a nova associação de lote e entrada
                await Lote_Entrada.create({
                    Lote_id,
                    Ent_id,
                    Ent_quantidade,
                    Ent_valor
                }, { transaction });
            } else {
                // Se já existe essa combinação de Lote_id e Ent_id, lançamos um erro ou avisamos
                console.log(`A associação para Lote ${Lote_id} e Entrada ${Ent_id} já existe.`);
            }
        } catch (error) {
            console.error('Erro ao associar lote à entrada:', error);
            throw error;
        }
    },

    // GET /entrada - Mostrar todas as entradas
    show: async (req: Request, res: Response) => {
        try {
            // Recupera todas as entradas, incluindo as associações com Lotes e a tabela de junção Lote_Entrada
            const entradas = await Entrada.findAll({
                include: [{
                    model: Lote,
                    through: {}
                },{
                    model: Usuario,
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
