import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada';
import { Op } from 'sequelize';
import { Saida } from '../models/Saida';
import { Lote } from '../models/Lote';
import { Produto } from '../models/Produto';
import { Categoria } from '../models/Categoria';

export const controllerEstatisticas = {
    showLucro: async (req: Request, res: Response) => {
        try {
        const data = [

        ]

        let today = new Date();
        let priorDate = new Date(new Date().setDate(today.getDate() - 30));

        console.log(priorDate)

        for (let i = 29; i >= 0; i--){
            priorDate = new Date(new Date().setDate(today.getDate() - i));

            let startOfDay = new Date(priorDate);
            startOfDay.setHours(0, 0, 0, 0);

            let endOfDay = new Date(priorDate);
            endOfDay.setHours(23, 59, 59, 999);

            let entrada = await Entrada.findAll({where: {Ent_dataCriacao: {[Op.between]: [startOfDay, endOfDay],}}})
            let saida = await Saida.findAll({where: {Saida_dataCriacao: {[Op.between]: [startOfDay, endOfDay]}}})

            let Perda = 0;
            let gastos = 0;
            let custosTot = 0;
            let Lucro = 0;

            if (entrada.length > 0){
                entrada.forEach(e => {
                    gastos += parseFloat(e.Ent_valortot.toString());     
                })
            }

            if (saida.length > 0){
                saida.forEach(s => {
                    if (s.Saida_isVenda == false){
                    Perda += parseFloat(s.Saida_valorTot.toString());
                    }
                    else{
                        Lucro += parseFloat(s.Saida_valorTot.toString());
                    }
                })
            }

            custosTot += Perda + gastos;

            Lucro -= custosTot;

            let values = {date: priorDate, lucro: Lucro, gastos: gastos, perda: Perda}
            data.push(values);
        }

        res.status(200).json(data)

    } catch (error){
        res.status(500).json({error: `Erro ao calcular o lucro: ${error}`})
    }
    },

    showPerda: async (req: Request, res: Response) => {
        try {
        const data = [

        ]

        let today = new Date();
        let priorDate = new Date(new Date().setDate(today.getDate() - 30));

        console.log(priorDate)

        for (let i = 29; i >= 0; i--){
            priorDate = new Date(new Date().setDate(today.getDate() - i));

            let startOfDay = new Date(priorDate);
            startOfDay.setHours(0, 0, 0, 0);

            let endOfDay = new Date(priorDate);
            endOfDay.setHours(23, 59, 59, 999);
            let saida = await Saida.findAll({where: {Saida_dataCriacao: {[Op.between]: [startOfDay, endOfDay]}}})

            let Perda = 0;

            if (saida.length > 0){
                saida.forEach(s => {
                    if (s.Saida_isVenda == false){
                    Perda += parseFloat(s.Saida_valorTot.toString());
                    }
                })
            }

            let values = {date: priorDate, perda: Perda}
            data.push(values);
        }

        res.status(200).json(data)

    } catch (error){
        res.status(500).json({error: `Erro ao calcular a perda: ${error}`})
    }
    },

    getMaiorEntrada: async (req, res) => {
        try {
            const entradas = await Entrada.findAll({
                include: [
                    {
                        model: Lote,
                        include: [
                            {
                                model: Produto,
                                include: [{
                                    model: Categoria
                                }]
                            }
                        ]
                    }
                ],
            })

            if(!entradas){
                return res.status(400).json({message: 'erro ao encontrar entradas'})
            }

            const lista = []
            entradas.forEach((e) => {
                e.Lotes.forEach((l) => {
                    const existente = lista.find((li) => l['Produtos']['Prod_nome'] === li['Prod_nome'])
                    if(existente){
                        existente['Quantidade'] += l['Lote_Entrada']['Ent_quantidade']
                        return
                    }
                    const nome = l['Produtos']['Prod_nome']
                    const categoria = l['Produtos']['Categoria']['Categoria_nome']
                    const quantidade = l['Lote_Entrada']['Ent_quantidade']
                    lista.push({
                        Prod_nome: nome,
                        CategoriaPai: categoria,
                        Quantidade: quantidade
                    })
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['Quantidade'] - a['Quantidade']).splice(0, 10)

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            res.status(500).json({error: `Erro ao acessar entradas: ${error}`})
        }
    },

    getMaiorSaida: async (req, res) => {
        try {
            const saidas = await Saida.findAll({
                include: [
                    {
                        model: Lote,
                        include: [
                            {
                                model: Produto,
                                include: [{
                                    model: Categoria
                                }]
                            }
                        ]
                    }
                ],
            })

            if(!saidas){
                return res.status(400).json({message: 'erro ao encontrar saidas'})
            }

            const lista = []
            saidas.forEach((s) => {
                s.Lotes.forEach((l) => {
                    const existente = lista.find((li) => l['Produtos']['Prod_nome'] === li['Prod_nome'])
                    if(existente){
                        existente['Quantidade'] += l['lote_Saida']['Saida_quantidade']
                        return
                    }
                    const nome = l['Produtos']['Prod_nome']
                    const categoria = l['Produtos']['Categoria']['Categoria_nome']
                    const quantidade = l['Lote_Saida']['Saida_quantidade']
                    lista.push({
                        Prod_nome: nome,
                        CategoriaPai: categoria,
                        Quantidade: quantidade
                    })
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['Quantidade'] - a['Quantidade']).splice(0, 10)

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            res.status(500).json({error: `Erro ao acessar saídas: ${error}`})
        }
    },

    getMaiorRentabildiade: async (req, res) => {
        try {
            const lotes = await Lote.findAll({
                include: [
                    {
                        model: Entrada
                    },
                    {
                        model: Saida
                    },
                    {
                        model: Produto,
                        include: [
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]
            })

            const lista = []
            lotes.forEach((l) => {
                const nome = l['Produtos']['Prod_nome']
                const categoria = l['Produtos']['Categoria']['Categoria_nome']
                const entradaQtd = l.Entradas.reduce((acc, atual) => acc + atual['Lote_Entrada']['Ent_quantidade'], 0)
                const custoTotal = entradaQtd * l['Produtos']['Prod_custo']
                const saidaQtd = l.Saidas.reduce((acc, atual) => acc + atual['Lote_Saida']['Saida_quantidade'], 0)
                const vendaTotal = saidaQtd * l['Produtos']['Prod_preco']
                const valorTotal = vendaTotal - custoTotal

                const existente = lista.find((li) => li['Prod_nome'] === nome)
                if(existente){
                    existente['ValorTot'] += valorTotal
                    return
                }

                lista.push({
                    Prod_nome: nome, 
                    CategoriaPai: categoria, 
                    ValorTot: valorTotal
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['ValorTot'] - a['ValorTot']).splice(0, 10)

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            return res.status(500).json({error: `Erro ao acessar produtos: ${error}`})
        }
    },

    getMaiorCusto: async (req, res) => {
        try {
            const lotes = await Lote.findAll({
                include: [
                    {
                        model: Entrada
                    },
                    {
                        model: Saida
                    },
                    {
                        model: Produto,
                        include: [
                            {
                                model: Categoria
                            }
                        ]
                    }
                ]
            })

            const lista = []
            lotes.forEach((l) => {
                const nome = l['Produtos']['Prod_nome']
                const categoria = l['Produtos']['Categoria']['Categoria_nome']
                const entradaQtd = l.Entradas.reduce((acc, atual) => acc + atual['Lote_Entrada']['Ent_quantidade'], 0)
                const custoTotal = entradaQtd * l['Produtos']['Prod_custo']

                const existente = lista.find((li) => li['Prod_nome'] === nome)
                if(existente){
                    existente['ValorTot'] += custoTotal
                    return
                }

                lista.push({
                    Prod_nome: nome, 
                    CategoriaPai: categoria, 
                    ValorTot: custoTotal
                })
            })
            const listaOrdenada = lista.sort((a, b) => b['ValorTot'] - a['ValorTot']).splice(0, 10)

            return res.status(200).json(listaOrdenada)
        } catch (error) {
            return res.status(500).json({error: `Erro ao acessar produtos: ${error}`})
        }
    }
}
