import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo, HasMany } from 'sequelize-typescript';
import { Setor } from './Setor';
import { Lote } from './Lote';

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
}