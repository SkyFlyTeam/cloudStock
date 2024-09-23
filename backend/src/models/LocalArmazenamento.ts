import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Setor } from './Setor';

@Table({
  tableName: 'LocalArmazenamento',
  timestamps: false,
})
export class LocalArmazenamento extends Model<LocalArmazenamento> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  LocAr_id!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  LocAr_nome!: string;

  @ForeignKey(() => Setor)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  Setor_id!: number;

  @BelongsTo(() => Setor)
  Setor!: Setor;
}