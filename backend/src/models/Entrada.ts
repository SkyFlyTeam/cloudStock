import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Usuario } from './Usuario';

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
}
