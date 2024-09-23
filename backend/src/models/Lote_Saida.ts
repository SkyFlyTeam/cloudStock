import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Lote } from './Lote';
import { Saida } from './Saida'


@Table({
  tableName: 'Lote_Saida',
  timestamps: false,
})
export class LoteSaida extends Model<LoteSaida> {
  @ForeignKey(() => Lote)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  Lote_id!: number;

  @ForeignKey(() => Saida)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  Saida_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Saida_quantidade!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  Saida_valor!: number;
}
