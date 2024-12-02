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

	@AfterCreate
	static async registrarCriacao(instance: Setor, options: any) {
	  try {
		const usuario_id = options.context?.usuario_id;
		const response = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
		const usuario = await response.json();
  
		await Registros.create({
		  Registro_Mensagem: `Setor criado: "${instance.Setor_nome}"`,
		  Registro_Data: new Date(),
		  Registro_Repsonsavel: `${usuario.Usuario_nome}`,
		  Registro_Tipo: 'CREATE',
		  Registro_Chave: instance.Setor_id,
		  Registro_ValorTotal: null,
		});
	  } catch (error) {
		console.error('Erro ao registrar criação do setor:', error);
	  }
	}
  
	@AfterUpdate
	static async registrarAlteracao(instance: Setor, options: any) {
	  try {
		const usuario_id = options.context?.usuario_id;
		const response = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
		const usuario = await response.json();
  
		if (instance.changed('Setor_nome')) {
		  const nomeAntigo = instance.previous('Setor_nome');
		  await Registros.create({
			Registro_Mensagem: `Setor "${nomeAntigo}" renomeado para "${instance.Setor_nome}"`,
			Registro_Data: new Date(),
			Registro_Repsonsavel: `${usuario.Usuario_nome}`,
			Registro_Tipo: 'UPDATE',
			Registro_Chave: instance.Setor_id,
			Registro_ValorTotal: null,
		  });
		}
  
		if (instance.changed('Setor_status')) {
		  const statusAntigo = instance.previous('Setor_status') ? 'Ativo' : 'Inativo';
		  const statusNovo = instance.Setor_status ? 'Ativo' : 'Inativo';
		  await Registros.create({
			Registro_Mensagem: `Status do setor "${instance.Setor_nome}" alterado de "${statusAntigo}" para "${statusNovo}"`,
			Registro_Data: new Date(),
			Registro_Repsonsavel: `${usuario.Usuario_nome}`,
			Registro_Tipo: 'UPDATE',
			Registro_Chave: instance.Setor_id,
			Registro_ValorTotal: null,
		  });
		}
	  } catch (error) {
		console.error('Erro ao registrar alteração no setor:', error);
	  }
	}

}
