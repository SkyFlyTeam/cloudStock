import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Lote } from './Lote';
import { Entrada } from './Entrada';

@Table({
  tableName: 'Lote_Entrada',
  timestamps: false,
})
export class LoteEntrada extends Model<LoteEntrada> {
  @ForeignKey(() => Lote)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  Lote_id!: number;

  @ForeignKey(() => Entrada)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  Ent_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Ent_quantidade!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Ent_valor!: number;
}
