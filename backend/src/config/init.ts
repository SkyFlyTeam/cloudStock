import { Cargo } from '../models/Cargo';
import sequelize from './connection';

export default async function init() {
    try {
        // Sincroniza o modelo com o banco de dados
        await sequelize.sync({ alter: true }); 
        
        // Verifique e insira os cargos padrão
        const cargos = [
            { Cargo_id: 1, Cargo_acesso: 'funcionario' },
            { Cargo_id: 2, Cargo_acesso: 'gerente' },
            { Cargo_id: 3, Cargo_acesso: 'administrador' }
        ];

        for (const cargoData of cargos) {
            const [cargo, created] = await Cargo.findOrCreate({
                where: { Cargo_id: cargoData.Cargo_id },
                defaults: cargoData
            });

            if (created) {
                console.log(`Cargo ${cargo.Cargo_acesso} criado com sucesso.`);
            }
        }

        console.log('Cargos verificados com sucesso.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}