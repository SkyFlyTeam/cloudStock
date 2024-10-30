import { Cargo } from '../models/Cargo';
import { ConfigSistema } from '../models/ConfigSistema';
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

           //Verifica as configuraçãoes de sistema e as cria caso seja a primeira inicialização do sistema
            const config = {Config_id: 1, Config_estoqueMinimo: 5, Config_avisoValidade: 5}

            const [configs, configCreated] = await ConfigSistema.findOrCreate({
                where: { Config_id: config.Config_id },
                defaults: config
            })

            if (configCreated){
                console.log(`Configuração de sistema ${configs.Config_id} criado com sucesso.`);
            }

        console.log('Cargos e configurações de sistema verificados com sucesso.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}