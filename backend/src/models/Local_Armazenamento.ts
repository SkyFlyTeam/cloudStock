import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, HasMany, AfterCreate, AfterUpdate, BeforeUpdate } from 'sequelize-typescript';
import { Setor } from './Setor';
import { Lote } from './Lote';
import { Registros } from './Registros';

@Table({
	tableName: 'Local_Armazenamento',
	timestamps: false,
})

export class Local_Armazenamento extends Model {

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true
	})
	LocAr_id!: number;

	@Column({
		type: DataType.STRING(30),
		allowNull: true
	})
	LocAr_nome!: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: false
	})
	LocAr_status!: boolean;

	@ForeignKey(() => Setor)
	@Column({
		type: DataType.INTEGER,
		allowNull: false
	})
	Setor_id!: number;

	@BelongsTo(() => Setor)
	Setores!: Setor[];

	@HasMany(() => Lote)
	Lotes!: Lote[];


	// Hook para registrar criação
	@AfterCreate
	static async registrarCriacao(instance: Local_Armazenamento, options: any) {
		try {
			
			const usuario_id = options.context?.usuario_id
			const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
            const jsonData = await nome.json();

			await Registros.create({
				Registro_Mensagem: `Criado Local de Armazenamento ID ${instance.LocAr_id}, Nome: "${instance.LocAr_nome}", Status: ${instance.LocAr_status ? 'Ativo' : 'Inativo'
					}`,
				Registro_Data: new Date(),
				Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
				Registro_Tipo: 'CREATE',
				Registro_Chave: instance.LocAr_id,
				Registro_ValorTotal: null, // Pode ser ajustado conforme necessário
			});
		} catch (error) {
			console.error('Erro ao registrar criação no Local de Armazenamento:', error);
		}
	}

	// Registro após atualização
	@AfterUpdate
	static async registrarAlteracao(instance: Local_Armazenamento, options:any) {
		try {
			// Obtém o nome do responsável pela atualização
			const usuario_id = options.context?.usuario_id
			console.log(usuario_id, 'gay')
			const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
            const jsonData = await nome.json();

			// Verifica mudanças no nome
			if (instance.changed('LocAr_nome')) {
				const nomeAntigo = instance.previous('LocAr_nome') as string;

				await Registros.create({
					Registro_Mensagem: `Local de Armazenamento alterado: "${nomeAntigo}" renomeado para "${instance.LocAr_nome}"`,
					Registro_Data: new Date(),
					Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
					Registro_Tipo: 'UPDATE',
					Registro_Chave: instance.LocAr_id,
					Registro_ValorTotal: null,
				});
			}
			
			// Verifica mudanças no status
			if (instance.changed('LocAr_status')) {
				const statusAntigo = instance.previous('LocAr_status') ? 'Ativo' : 'Inativo';
				const statusNovo = instance.LocAr_status ? 'Ativo' : 'Inativo';

				await Registros.create({
					Registro_Mensagem: `Local de Armazenamento ${instance.LocAr_nome} teve o status alterado: "${statusAntigo}" para "${statusNovo}"`,
					Registro_Data: new Date(),
					Registro_Repsonsavel: `Sistema`,
					Registro_Tipo: 'UPDATE',
					Registro_Chave: instance.LocAr_id,
					Registro_ValorTotal: null,
				});
			}
		} catch (error) {
			console.error('Erro ao registrar alteração no Local de Armazenamento:', error);
		}
	}
}