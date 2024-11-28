import { Table, Column, Model, DataType, HasMany, AfterCreate, AfterUpdate } from 'sequelize-typescript';
import { Local_Armazenamento } from './Local_Armazenamento';
import { Registros } from './Registros';

@Table({
	tableName: 'Setor',
	timestamps: false,
})
export class Setor extends Model {
	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	})
	Setor_id!: number;

	@Column({
		type: DataType.STRING(100),
		allowNull: true,
	})
	Setor_nome!: string;

	@Column({
		type: DataType.BOOLEAN,
		allowNull: true,
	})
	Setor_status!: boolean;

	@HasMany(() => Local_Armazenamento)
	Locais_Armazenamento!: Local_Armazenamento[];
	Usuario_id: any;

	@AfterCreate
	static async afterCreateHook(instance: Setor) {
		const nome = await fetch(`http://localhost:5000/usuario/${instance.Usuario_id}`);
		const jsonData = await nome.json();

		try {
			// Registra a criação do setor
			await Registros.create({
				Registro_Mensagem: `Novo setor criado: ${instance.Setor_nome}`,
				Registro_Data: new Date(),
				Registro_Repsonsavel: `${jsonData.Usuario_nome}`, 
				Registro_Tipo: 'Sistema',
				Registro_Chave: instance.Setor_id,
				Registro_ValorTotal: null,
			});
		} catch (error) {
			console.error('Erro ao registrar criação de setor:', error);
		}
	}

	@AfterUpdate
	static async afterUpdateHook(instance: Setor) {
		try {
			const nome = await fetch(`http://localhost:5000/usuario/${instance.Usuario_id}`);
			const jsonData = await nome.json();
			
			// Verifica se o nome foi alterado
			if (instance.changed('Setor_nome')) {
				const setorAntigo = await Setor.findOne({ where: { Setor_id: instance.Setor_id } });

				if (setorAntigo) {
					await Registros.create({
						Registro_Mensagem: `Novo setor alterado: ${setorAntigo.Setor_nome} renomeado para ${instance.Setor_nome}`,
						Registro_Data: new Date(),
						Registro_Repsonsavel: `${jsonData.Usuario_nome}`, 
						Registro_Tipo: 'Setor',
						Registro_Chave: instance.Setor_id,
						Registro_ValorTotal: null,
					});
				}
			}
		} catch (error) {
			console.error('Erro ao registrar alteração de setor:', error);
		}
	}

}
