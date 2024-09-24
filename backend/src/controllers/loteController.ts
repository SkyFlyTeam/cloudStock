import { Lote } from '../models/Lote';
import { Produto } from '../models/Produto';  // Assuming Produto model exists
import { Local_Armazenamento } from '../models/Local_Armazenamento'; // Assuming LocalArmazenamento model exists

const controllerLote = {
    // POST /lote
    save: async (req, res) => {
        try {
            const { loteId, loteValidade, loteQuantidade, loteCod, ProdutoProdCod, localArmzLocAirId } = req.body;
            
            // Check for required fields
            if (!loteId || !loteValidade || !loteQuantidade || !loteCod || !ProdutoProdCod || !localArmzLocAirId) {
                return res.status(400).json({ error: "All fields are required: loteId, loteValidade, loteQuantidade, loteCod, ProdutoProdCod, localArmzLocAirId" });
            }
            
            // Create the Lote
            const lote = await Lote.create({
                loteId,
                loteValidade,
                loteQuantidade,
                loteCod,
                ProdutoProdCod,
                localArmzLocAirId
            });
            
            return res.status(201).json(lote);
        } catch (error) {
            console.error('Error creating lote:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    // GET /lote
    show: async (req, res) => {
        try {
            // Fetch all Lotes with related Produto and LocalArmazenamento
            const lote = await Lote.findAll({
                include: [Produto, Local_Armazenamento],
            });

            return res.status(200).json(lote);
        } catch (error) {
            console.error('Error fetching lote with related data: ', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = controllerLote;
