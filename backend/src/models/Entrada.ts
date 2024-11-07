import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, AfterCreate, AfterUpdate } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { Lote_Entrada } from './Lote_Entrada';
import { Registros } from './Registros';
import { Notificacoes } from './Notificacoes';

@Table({
  tableName: 'Entrada',
  timestamps: false
})

export class Entrada extends Model {

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true
	})
	Ent_id!: number;

	@Column({
		type: DataType.DECIMAL(8, 2),
		allowNull: true
	})
	Ent_valortot!: number;

	@Column({
		type: DataType.DATE,
		allowNull: true
	})
	Ent_dataCriacao!: Date;

	@ForeignKey(() => Usuario)
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	Usuario_id!: number;

	@BelongsTo(() => Usuario)
	Usuario!: Usuario; // Singular, pois é uma relação de um para muitos

	@BelongsToMany(() => Lote, () => Lote_Entrada)
	Lotes!: Lote[];


	@AfterUpdate
	static async notificarRegistro(instance: Entrada) {
	try{
		const nome = await fetch(`http://localhost:5000/usuario/${instance.Usuario_id}`);
		const jsonData = await nome.json();
		await Registros.create({
			Registro_Mensagem: `Valor total: R$ ${Number(instance.Ent_valortot).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
			Registro_Data: new Date(),
			Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
			Registro_Tipo: "Entrada",
			Registro_Chave: instance.Ent_id
		})
	}
	catch (error) {
		console.error("Erro ao notificar registro:", error);
	  }
	}

	@AfterUpdate
	static async verificarEstoque(instance: Entrada) {
		try {
			// Adiciona um timeout para atrasar a execução da busca
			setTimeout(async () => {
				const instanceWithLotes = await Entrada.findAll({
					where: { Ent_id: instance.Ent_id },
					include: [Lote]
				});
	
	
				if (!instanceWithLotes || instanceWithLotes.length === 0 || !instanceWithLotes[0].Lotes || instanceWithLotes[0].Lotes.length === 0) {
					console.warn("Nenhum lote encontrado para esta entrada.");
					return;
				}
	
				// Faz uma única requisição para buscar todos os produtos
				const response = await fetch(`http://localhost:5000/produto`);
				const produtosData = await response.json();
				
				// Extrai os códigos de produto únicos dos lotes
				const uniqueProdCods = [...new Set(instanceWithLotes[0].Lotes.map(item => item.Prod_cod))];
	
				console.log('Produtos da entrada: ', uniqueProdCods);
		
				// Para cada código de produto, faz a verificação do estoque mínimo
				for (const prodCod of uniqueProdCods) {
					// Busca o estoque mínimo do produto a partir dos dados obtidos
					const produto = produtosData.find(p => p.Prod_cod === prodCod);
	
					if (!produto) continue; // Ignora se o produto não foi encontrado na lista
		
					const estoqueMinimo = produto.Prod_estoqueMinimo;
	
					const responseQuantidade = await fetch(`http://localhost:5000/lote/quantidade/${prodCod}`);
					const quantidade = await responseQuantidade.json();
	
					console.log('Produto:', produto);
					console.log('Quantidade:', quantidade);
		
					// Se a quantidade do produto for maior que o estoque, então tenho que excluir a notificação de Estoque
					if (quantidade >= estoqueMinimo) {
						// Verifica se já existe uma notificação para este produto e tipo "Estoque"
						const notificacaoExistente = await Notificacoes.findOne({
							where: {
								Prod_cod: prodCod,
								Not_tipo: 'Estoque'
							}
						});
	
						// Se houver uma notificação para aquele produto, excluí a notificação
						if (notificacaoExistente) {
							console.log('destruindo notificação');
							await Notificacoes.destroy({
								where: {
									Not_tipo: 'Estoque',
									Prod_cod: produto.Prod_cod,
								},                                
								individualHooks: true, 
                                force: true 
							});
						}
					}

					//Verificar a validade dos novos lotes
					for(const lote of produto.Lotes){
						// Não verifica lotes que não contém validade
						if(lote.Lote_validade != null){
							console.log('lote.Lote_id', lote.Lote_id)
							// Verifica se já existe uma notificação para o lote
							const notificacaoExistente = await Notificacoes.findOne({
								where: {
									Lote_id: lote.Lote_id,
									Not_tipo: 'Validade'
								}
							});
	
							console.log('Notificação', notificacaoExistente)

							if (!notificacaoExistente && lote.Lote_quantidade > 0) {
								const validade = new Date(lote.Lote_validade)
								const dataAtual = new Date()
	
								dataAtual.setHours(0, 0, 0, 0);
								validade.setHours(0, 0, 0, 0);
	
								const diferenca = (validade.getTime() - dataAtual.getTime())/ (24 * 60 * 60 * 1000); 
	
								// Verifique se a validade está dentro do limite de 7 dias 
								if (diferenca < 0 || diferenca <=7 ) {
									await Notificacoes.create({
										Not_tipo: 'Validade',
										Not_data: new Date(),
										Prod_cod: produto.Prod_cod,
										Lote_id: lote.Lote_id
									});
								}
							}
						}
					}
				}
			}, 1000); // Atraso de 1 segundo
		} catch (error) {
			console.error("Erro ao excluir notificação:", error);
		}
	}
}
