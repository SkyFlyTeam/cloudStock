import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, HasMany } from 'sequelize-typescript';
import { LocalArmazenamento } from './LocalArmazenamento';

@Table({
  tableName: 'Setor',
  timestamps: false,
})

export class Setor extends Model<Setor> {
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

  @HasMany(() => LocalArmazenamento)
  LocalArmazenamento!: LocalArmazenamento[];
}