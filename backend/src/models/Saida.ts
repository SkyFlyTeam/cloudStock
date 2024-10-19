import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, AfterCreate } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { Lote_Saida } from './Lote_Saida'
import { Registros } from './Registros';

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

	@AfterCreate
	static async notificarRegistro(instance: Saida) {

		const nome = await fetch(`http://localhost:5000/usuario/${instance.Usuario_id}`);
		const jsonData = await nome.json();
		await Registros.create({
			Registro_Mensagem: `Valor total: R$ ${instance.Saida_valorTot}`,
			Registro_Data: new Date(),
			Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
			Registro_Tipo: "Saida",
			Registro_Chave: instance.Saida_id
		})
	}
}

