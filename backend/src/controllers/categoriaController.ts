import { Categoria } from '../models/Categoria';
import { Produto } from '../models/Produto';

const controllerCategoria = {
    // POST /categoria
    save: async (req, res) => {
        try {
            const { Categoria_id, Categoria_status, Categoria_pai } = req.body;
            if (!Categoria_id || !Categoria_status || !Categoria_pai ) {
                return res.status(400).json({ error: "All fields are required: Categoria_id, Categoria_status, Categoria_pai " });
            }
            const lote = await Categoria.create({
                Categoria_id,
                Categoria_status,
                Categoria_pai
            });
            return res.status(201).json(lote);
            } catch (error) {
                console.error('Error creating lote:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        },
    // GET /categoria
    show: async (req, res) => {
        try {
            const lote = await Categoria.findAll({
                include: [Produto],
            });

            return res.status(200).json(lote);
        } catch (error) {
            console.error('Error fetching lote with suppliers: ', error);
            return res.status(500).json({ error: 'Internal server error '});
        }
    }
    }

module.exports = controllerCategoria