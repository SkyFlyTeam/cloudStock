import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Lote } from './Lote';
import { Entrada } from './Entrada';

@Table({
  tableName: 'Lote_Entrada',
  timestamps: false,
})

export class Lote_Entrada extends Model {

    @ForeignKey(() => Lote)
    @Column({
      type: DataType.INTEGER
    })
    Lote_id!: number;

    @ForeignKey(() => Entrada)
    @Column({
      type: DataType.INTEGER
    })
    Ent_id!: number;

    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    Ent_quantidade!: number;

    @Column({
      type: DataType.DECIMAL(8, 2),
      allowNull: false,
    })
    Ent_valor!: number;
}
