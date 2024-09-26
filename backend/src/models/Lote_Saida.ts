import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Lote } from './Lote';
import { Saida } from './Saida'

@Table({
  tableName: 'Lote_Saida',
  timestamps: false
})

export class Lote_Saida extends Model {

	@ForeignKey(() => Lote)
	@Column({
		type: DataType.INTEGER
	})
	Lote_id!: number;

	@ForeignKey(() => Saida)
	@Column({
		type: DataType.INTEGER
	})
	Saida_id!: number;

	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	Saida_quantidade!: number;

	@Column({
		type: DataType.DECIMAL(8, 2),
		allowNull: false,
	})
	Saida_valor!: number;
}
