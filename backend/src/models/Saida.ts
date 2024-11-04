import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, AfterCreate, AfterUpdate } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { Lote_Saida } from './Lote_Saida'
import { Registros } from './Registros';
import { Notificacoes } from './Notificacoes';

@Table({
  tableName: 'Saida',
  timestamps: false
})

export class Saida extends Model{
  
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true
	})
	Saida_id!: number;

	@Column({
		type: DataType.DECIMAL(8, 2),
		allowNull: true
	})
	Saida_valorTot!: number;

	@Column({
		type: DataType.DATE,
		allowNull: false
	})
	Saida_dataCriacao!: Date;

	@ForeignKey(() => Usuario)
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	Usuario_id!: number;

	@BelongsTo(() => Usuario)
	Usuarios!: Usuario;

	@BelongsToMany(() => Lote, () => Lote_Saida)
	Lotes!: Lote[]


	@AfterUpdate // Ativa o hook após a criação e após a atualização
	static async notificarRegistro(instance: Saida) {
	  try {
		const response = await fetch(`http://localhost:5000/usuario/${instance.Usuario_id}`);
		const jsonData = await response.json();
		
		await Registros.create({
		  Registro_Mensagem: `Valor total: R$ ${Number(instance.Saida_valorTot).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
		  Registro_Data: new Date(),
		  Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
		  Registro_Tipo: "Saida",
		  Registro_Chave: instance.Saida_id
		});
  
	  } catch (error) {
		console.error("Erro ao notificar registro:", error);
	  }
	}

	@AfterUpdate
	static async verificarEstoque(instance: Saida) {
		try {
			const instanceWithLotes = await Saida.findByPk(instance.Saida_id, { include: [Lote] });
			if (!instanceWithLotes.Lotes || instanceWithLotes.Lotes.length === 0) {
				console.warn("Nenhum lote encontrado para esta entrada.");
				return;
			}

			// Faz uma única requisição para buscar todos os produtos
			const response = await fetch(`http://localhost:5000/produto`);
			const produtosData = await response.json();
			
			// Extrai os códigos de produto únicos dos lotes
			const uniqueProdCods = [...new Set(instanceWithLotes.Lotes.map(item => item.Prod_cod))];
	
			// Para cada código de produto, faz a verificação do estoque mínimo
			for (const prodCod of uniqueProdCods) {
	
				// Busca o estoque mínimo do produto a partir dos dados obtidos
				const produto = produtosData.find(p => p.Prod_cod === prodCod);

				if (!produto) continue; // Ignora se o produto não foi encontrado na lista
	
				const estoqueMinimo = produto.Prod_estoqueMinimo;

				const responseQuantidade = await fetch(`http://localhost:5000/lote/quantidade/${prodCod}`);
				const quantidade = await responseQuantidade.json();
	
				if (quantidade <= estoqueMinimo) {
					// Verifica se já existe uma notificação para este produto e tipo "Estoque"
					const notificacaoExistente = await Notificacoes.findOne({
						where: {
							Prod_cod: prodCod,
							Not_tipo: 'Estoque'
						}
					});

					// Se não existir notificação, cria uma nova
					if (!notificacaoExistente) {
						await Notificacoes.create({
							Not_tipo: 'Estoque',
							Not_data: new Date(),
							Prod_cod: prodCod,
							Lote_id: null
						});
					} else {
						console.log(`Notificação já existente para produto ${prodCod}`);
					}
				}

				//Verificar se foram zerados lotes expirados
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

						// Se existir notificação para este lote e a quantidade do lote estiver zerada, exclui a notificação
                        if (notificacaoExistente && lote.Lote_quantidade == 0) {
                            await Notificacoes.destroy({
								where: {
									Not_tipo: 'Validade',
									Prod_cod: produto.Prod_cod,
									Lote_id: lote.Lote_id
								}
							}); 
						}
                    }
                }
			}
		} catch (error) {
			console.error("Erro ao criar notificação:", error);
		}
	}
}
