import { Produto } from '../models/Produto';
import { Notificacoes } from '../models/Notificacoes';
import { Lote } from '../models/Lote';
import { ConfigSistema } from '../models/ConfigSistema';

const cron = require('node-cron');

const iniciarNotificacaoCron = () => {
    const gerarNotificacoesValidade = async () => {
        try {
            const produtos = await Produto.findAll({ include: [Lote] })
            const dataAtual = new Date()

            for(const produto of produtos){
                for(const lote of produto.Lotes){
                    // Não verifica lotes que não contém validade
                    if(lote.Lote_validade != null){
                        
                        // Verifica se já existe uma notificação para o lote
                        const notificacaoExistente = await Notificacoes.findOne({
                            where: {
                                Lote_id: lote.Lote_id,
                                Not_tipo: 'Validade'
                            }
                        });

                        if (!notificacaoExistente && lote.Lote_quantidade > 0) {
                            const validade = new Date(lote.Lote_validade)
                            const avisoValidade = await ConfigSistema.findByPk(1)

                            dataAtual.setHours(0, 0, 0, 0);
                            validade.setHours(0, 0, 0, 0);

                            const diferenca = (validade.getTime() - dataAtual.getTime())/ (24 * 60 * 60 * 1000); 

                            // Verifique se a validade está dentro do limite de 7 dias 
                            if (diferenca < 0 || diferenca <= avisoValidade.Config_avisoValidade ) {
                                await Notificacoes.create({
                                    Not_tipo: 'Validade',
                                    Not_data: new Date(),
                                    Prod_cod: produto.Prod_cod,
                                    Lote_id: lote.Lote_id
                                });
                            }
                        } 
                        else if(notificacaoExistente != null && lote.Lote_quantidade == 0){
                            await Notificacoes.destroy({
                                where: {
                                    Not_tipo: 'Validade',
                                    Prod_cod: produto.Prod_cod,
                                    Lote_id: lote.Lote_id
                                },
                                individualHooks: true, 
                                force: true 
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao criar notificações para produtos expirados:', error);
        }
        cron.schedule('0 5 * * *', gerarNotificacoesValidade)
    }
    gerarNotificacoesValidade()
}

export default iniciarNotificacaoCron