import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { Lote_Entrada } from './Lote_Entrada';

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
}
