import { Lote } from "../models/Lote";
import { Lote_Saida } from "../models/Lote_Saida";
import { Saida } from "../models/Saida";

export const controllerLoteSaida = {

    // GET /loteSaida
    show: async (req, res) => {
        try {
            // Fetch all Lotes with related Produto and LocalArmazenamento
            const loteSaida = await Lote_Saida.findAll({
                include: [Lote, Saida],
            });

            return res.status(200).json(loteSaida);
        } catch (error) {
            console.error('Error fetching lote with related data: ', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
}