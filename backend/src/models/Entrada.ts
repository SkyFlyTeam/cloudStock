import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Usuario } from './Usuario';
import { Lote } from './Lote';
import { LoteEntrada } from './Lote_Entrada';

@Table({
  tableName: 'Entrada',
  timestamps: false,
})
export class Entrada extends Model<Entrada> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  Ent_id!: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  Ent_valortot!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  Ent_dataCriacao!: Date;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  perfil_id!: number;

  @BelongsTo(() => Usuario)
  usuario!: Usuario; // Singular, pois é uma relação de um para muitos

  @BelongsToMany(() => Lote, () => LoteEntrada)
  lotes!: Lote[];
}
