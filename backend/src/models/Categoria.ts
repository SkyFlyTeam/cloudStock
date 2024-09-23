import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Produto } from './Produto';




@Table({
  tableName: 'Categoria',
  timestamps: false,
})
export class Categoria extends Model<Categoria> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  Categoria_id!: number;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  Categoria_status!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  Categoria_pai!: number;


  @HasMany(() => Produto)
  produtos!: Produto[];
}
