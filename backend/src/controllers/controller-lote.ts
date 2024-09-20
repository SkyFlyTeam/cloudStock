import { Lote } from '../models/Lote';

const controllerLote = {
    // POST /lote
    save: async (req, res) => {
        try {
            const { loteId, loteValidade, loteQuantidade, loteCod, ProdutoCod, localArmzLocAirId } = req.body;
            if (!loteId || !loteValidade || !loteQuantidade || !loteCod || !ProdutoCod || !localArmzLocAirId) {
                return res.status(400).json({ error: "All fields are required: loteId, loteValidade, loteQuantidade, loteCod, ProdutoCod, localArmzLocAirId " });
            }
            const lote = await Lote.create({
                loteId,
                loteValidade,
                loteQuantidade,
                loteCod,
                ProdutoCod,
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
            const lote = await Lote.findAll({
                include: [Supplier],
            });

            return res.status(200).json(lote);
        } catch (error) {
            console.error('Error fetching lote with suppliers: ', error);
            return res.status(500).json({ error: 'Internal server error '});
        }
    }
    }

module.exports = controlllerLote