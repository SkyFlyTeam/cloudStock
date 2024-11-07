import { Cargo } from '../models/Cargo';
import { ConfigSistema } from '../models/ConfigSistema';
import { Unidade_Medida } from '../models/Unidade_Medida';
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

        const unidadesMedidas = [
            { UnidadeMedida_id: 1, UnidadeMedida_nome: 'un' },        // unidade
            { UnidadeMedida_id: 2, UnidadeMedida_nome: 'caixa' },
            { UnidadeMedida_id: 3, UnidadeMedida_nome: 'pct' },       // pacote
            { UnidadeMedida_id: 4, UnidadeMedida_nome: 'fardo' },
            { UnidadeMedida_id: 5, UnidadeMedida_nome: 'palete' },
            { UnidadeMedida_id: 6, UnidadeMedida_nome: 'kg' },        // quilograma
            { UnidadeMedida_id: 7, UnidadeMedida_nome: 'g' },         // grama
            { UnidadeMedida_id: 8, UnidadeMedida_nome: 'ton' },       // tonelada
            { UnidadeMedida_id: 9, UnidadeMedida_nome: 'l' },        // litro
            { UnidadeMedida_id: 10, UnidadeMedida_nome: 'ml' },       // mililitro
            { UnidadeMedida_id: 11, UnidadeMedida_nome: 'm' },        // metro
            { UnidadeMedida_id: 12, UnidadeMedida_nome: 'cm' },       // centímetro
            { UnidadeMedida_id: 13, UnidadeMedida_nome: 'par' },
            { UnidadeMedida_id: 14, UnidadeMedida_nome: 'rolo' },
            { UnidadeMedida_id: 15, UnidadeMedida_nome: 'dz' }        // dúzia
        ];

        for (const unidadeMedidaData of unidadesMedidas) {
            const [unidade, created] = await Unidade_Medida.findOrCreate({
                where: { UnidadeMedida_id: unidadeMedidaData.UnidadeMedida_id },
                defaults: unidadeMedidaData
            });

            if (created) {
                console.log(`Unidade de medida ${unidade.UnidadeMedida_nome} criada com sucesso.`);
            }
        }

        //Verifica as configuraçãoes de sistema e as cria caso seja a primeira inicialização do sistema
        const config = {Config_id: 1, Config_avisoValidade: 5}

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