import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, HasMany, BelongsTo } from 'sequelize-typescript';
import { Produto } from './Produto';

// Categoria pertence a uma outra categoria (Categoria Pai)
@Table({
  tableName: 'Categoria',
  timestamps: false
})
export class Categoria extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  Categoria_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true
  })
  Categoria_nome!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  Categoria_status!: boolean;

  @ForeignKey(() => Categoria)
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  Categoria_pai!: number;

  @BelongsTo(() => Categoria, 'Categoria_pai')
  categoriaPai?: Categoria;

  @HasMany(() => Categoria, 'Categoria_pai')
  subcategorias!: Categoria[];

  @HasMany(() => Produto)
  Produtos!: Produto[];
}
