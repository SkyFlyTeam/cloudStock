import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { LoteSaida } from './Lote_Saida'




@Table({
  tableName: 'Saida',
  timestamps: false,
})
export class Saida extends Model<Saida> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  Saida_id!: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  saida_valorTot!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  saida_dataCriacao!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  perfil_id!: number;

  @BelongsTo(() => Usuario)
  usuarios!: Usuario[];

  @BelongsToMany(() => Lote, () => LoteSaida)
  lotes!: Lote[]
}
