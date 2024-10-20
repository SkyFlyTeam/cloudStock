import { Entrada } from "../models/Entrada";
import { Lote } from "../models/Lote";
import { Lote_Entrada } from "../models/Lote_Entrada";

export const controllerLoteEntrada = {

    // GET /loteEntrada
    show: async (req, res) => {
        try {
            // Fetch all Lotes with related Produto and LocalArmazenamento
            const loteEntrada = await Lote_Entrada.findAll({
                include: [Lote, Entrada],
            });

            return res.status(200).json(loteEntrada);
        } catch (error) {
            console.error('Error fetching lote with related data: ', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
}