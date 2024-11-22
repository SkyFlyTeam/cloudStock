import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada';
import { Op } from 'sequelize';
import { Saida } from '../models/Saida';

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
    }
}
