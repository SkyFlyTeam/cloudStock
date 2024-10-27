import { Request, Response } from 'express';
import { Saida } from '../models/Saida';
import { Usuario } from '../models/Usuario';
import { Lote } from '../models/Lote';
import { Lote_Saida } from '../models/Lote_Saida';
import { Produto } from '../models/Produto';
import { Op } from 'sequelize';
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Fornecedor } from '../models/Fornecedor';

export const saidaController = {
    teste: async (req: Request, res: Response) => {
        const produtos = req.body
        console.log(produtos)
        res.json({message: 'TESTE OK'})
    },

    // POST criar uma nova saida
    save: async (req: Request, res: Response) => {
        try {
            const SaidaEnvio = await Saida.create({
                Saida_valorTot: 0,
                Saida_dataCriacao: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000), // Ajuste do fuso horário local
                Usuario_id: 1
            })

            const saidasSelecionadas = req.body
            const Lotes = await Lote.findAll({
                order: [
                    ['Lote_validade', 'ASC']
                ]
            })
            console.log(saidasSelecionadas)
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
                    let quantidadeDinamica = saidaCorrespondente.quantidade

                    for(const l of Lotes){
                        if (l.Prod_cod === produto.Prod_cod && l.Lote_quantidade > 0){
                            if (quantidadeDinamica <= l.Lote_quantidade){
                                await Lote.update({
                                    Lote_id: l.Lote_id,
                                    Lote_validade: l.Lote_validade,
                                    Lote_quantidade: l.Lote_quantidade -= quantidadeDinamica,
                                    Lote_cod: l.Lote_cod,
                                    LocAr_id: l.LocAr_id

                                }, {where: {Lote_id: l.Lote_id}})

                                const envio = {
                                    Lote_id: l.Lote_id,
                                    Saida_id: SaidaEnvio.Saida_id,
                                    Saida_quantidade: quantidadeDinamica,
                                    Saida_valor: produto.Prod_custo * quantidadeDinamica         
                                }
                                
                                saidaController.addLoteToSaidaFunc(envio);

                                break;
                            }

                            else {
                                quantidadeDinamica -= l.Lote_quantidade

                                await Lote.update({
                                    Lote_id: l.Lote_id,
                                    Lote_validade: l.Lote_validade,
                                    Lote_quantidade: 0,
                                    Lote_cod: l.Lote_cod,
                                    LocAr_id: l.LocAr_id

                                }, {where: {Lote_id: l.Lote_id}})

                                const envio = {
                                    Lote_id: l.Lote_id,
                                    Saida_id: SaidaEnvio.Saida_id,
                                    Saida_quantidade: l.Lote_quantidade,
                                    Saida_valor: produto.Prod_custo * l.Lote_quantidade         
                                }
                                
                                saidaController.addLoteToSaidaFunc(envio);
                            }
                            
                        }
                    };

                    // Calculando o total para o produto específico
                    Saida_valorTot += produto.Prod_custo * saidaCorrespondente.quantidade;
                }
            }

            if (SaidaEnvio){
                SaidaEnvio.Saida_valorTot = Saida_valorTot;
                SaidaEnvio.Saida_dataCriacao = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
                SaidaEnvio.Usuario_id = Usuario_id;
            }

            SaidaEnvio.save()

            return res.status(201).json(SaidaEnvio);
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

    addLoteToSaidaFunc: async (envio: any) => {
        try {
            const { Lote_id, Saida_id, Saida_quantidade, Saida_valor } = envio;

            // Verificar se a saída já existe
            const saida = await Saida.findByPk(Saida_id);
            // if (!saida) {
            //     return res.status(404).json({ message: 'Saída não encontrada' });
            // }

            // Verificar se o lote já existe
            const lote = await Lote.findByPk(Lote_id);
            // if (!lote) {
            //     return res.status(404).json({ message: 'Lote não encontrado' });
            // }

            // Criar a relação na tabela Lote_Saida
            const loteSaida = await Lote_Saida.create({
                Lote_id,
                Saida_id,
                Saida_quantidade,
                Saida_valor
            });

            // return res.status(201).json({ message: 'Lote associado à saída com sucesso', loteSaida });
        } catch (error) {
            console.error('Erro ao associar lote à saída:', error);
            // return res.status(500).json({ message: 'Erro ao associar lote à saída' });
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
    },
    showSpecific: async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            // Recupera todas as entradas, incluindo as associações com Lotes e a tabela de junção LoteEntrada
            const saida = await Saida.findByPk(id, {
                include: [
                    { 
                      model: Lote,
                      include: [
                        {
                          model: Produto,
                        },
                        {
                          model: Local_Armazenamento 
                        },
                        {
                          model: Fornecedor 
                        }
                      ]
                    },
                    {
                        model: Usuario
                    }
                  ]
            });
            // Se não houver entradas, retorna uma resposta apropriada
            if (!saida) {
                return res.status(404).json({ message: 'Nenhuma saida encontrada' });
            }
            // Retorna as entradas encontradas
            res.status(200).json(saida);
        } catch (error) {
            console.error('Erro ao recuperar as saidas:', error);
            res.status(500).json({ error: 'Erro ao recuperar as saidas' });
        }
    }
}