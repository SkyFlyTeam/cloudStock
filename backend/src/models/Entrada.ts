import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, AfterCreate, AfterUpdate } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { Lote_Entrada } from './Lote_Entrada';
import { Registros } from './Registros';

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
}
