import { Lote } from '../models/Lote';
import { Produto } from '../models/Produto';  // Assuming Produto model exists
import { Local_Armazenamento } from '../models/Local_Armazenamento'; // Assuming LocalArmazenamento model exists

export const controllerLote = {
    // POST /lote
    save: async (req, res) => {
        try {
            const { Lote_validade, Lote_quantidade, Lote_cod, Prod_cod, LocAr_id } = req.body;
            
            // Check for required fields
            if (!Lote_validade || !Lote_quantidade || !Lote_cod || !Prod_cod || !LocAr_id) {
                return res.status(400).json({ error: "All fields are required: Lote_id, Lote_validade, Lote_quantidade, Lote_cod, Prod_cod, LocAr_id" });
            }
            
            // Create the Lote
            const lote = await Lote.create({
                Lote_validade,
                Lote_quantidade,
                Lote_cod,
                Prod_cod,
                LocAr_id
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
    },

    showByLocal: async(req, res) => {
        const id = +req.params.id
        try {
            const lotes = await Lote.findAll({
                include: [Produto, Local_Armazenamento],
            });
    
            // Filtra os lotes que pertencem ao Local_Armazenamento com o id específico
            let produtos = lotes.filter(lote => lote.Locais_Armazenamento['LocAr_id'] === id).map((p) => p.Produtos)
            return res.status(200).json(produtos);
        } catch (error) {
            console.error('Error fetching lote with related data: ', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}