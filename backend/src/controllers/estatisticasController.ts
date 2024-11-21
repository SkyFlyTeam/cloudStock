import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada';

export const controllerEstatisticas = {
    show: async (req: Request, res: Response) => {
        const data = {
            lucroMensal: calcularPerdaMensal()
        }

        return res.status(200).json(data)
    }
}

async function calcularPerdaMensal(){
    try{
        let valor = 0;
        const ents = await Entrada.findAll();

        ents.forEach(ent => {
            valor += ent.Ent_valortot;
        });

        return valor;
    } catch (error) {
        console.error('Error calculating total lost', error)
        return 'Err404'
    }
}