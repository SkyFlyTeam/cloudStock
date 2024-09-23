import express, { Request, Response } from 'express';
import { Entrada } from '../models/Entrada'; // Importando o modelo Entrada
import { Lote } from '../models/Lote'; // Importando o modelo Lote
import { Usuario } from '../models/Usuario'; // Importando o modelo Usuario
import { LoteEntrada } from '../models/Lote_Entrada'; // Importando a tabela de junção

export const controllerEntrada = {
    // POST /entrada
    save: async (req: Request, res: Response) => {
        try {
          const { Ent_valortot, Ent_dataCriacao, perfil_id, lotes } = req.body;
      
          // Verifica se o perfil de usuário existe
          const usuario = await Usuario.findByPk(perfil_id);
          if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
          }
      
          // Cria a entrada
          const novaEntrada = await Entrada.create({
            Ent_valortot,
            Ent_dataCriacao,
            perfil_id,
          });
      
          // Verifica se os lotes existem e associa à nova entrada
          if (lotes && lotes.length > 0) {
            for (const loteId of lotes) {
              const lote = await Lote.findByPk(loteId);
              if (!lote) {
                return res.status(404).json({ error: `Lote com ID ${loteId} não encontrado` });
              }
      
              // Cria a relação na tabela Lote_Entrada
              await LoteEntrada.create({
                Lote_id: loteId,
                Ent_id: novaEntrada.Ent_id,
                Ent_quantidade: lote.loteQuantidade, // Defina a quantidade conforme a necessidade
                Ent_valor: 1, // Defina o valor conforme necessário
              });
      
              // Associa o lote à entrada
              await novaEntrada.$add('lotes', lote);
            }
          }
      
          res.status(201).json({ message: 'Entrada criada com sucesso', entrada: novaEntrada });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao criar entrada' });
        }
    },

    // GET /entrada
    show: async (req: Request, res: Response) => {
        try {
            // Recupera todas as entradas
            const entradas = await Entrada.findAll();

            // Se não houver entradas, retorna uma resposta apropriada
            if (!entradas || entradas.length === 0) {
                return res.status(404).json({ message: 'Nenhuma entrada encontrada' });
            }

            // Retorna as entradas encontradas
            res.status(200).json(entradas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao recuperar as entradas' });
        }
    }
}
