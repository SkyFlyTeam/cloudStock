import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Produto } from './Produto';  // Importar o modelo Product

@Table({
  tableName: 'suppliers',
  timestamps: true,
})
export class Supplier extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contactInfo?: string;

  // Definir a associação de HasMany
  @HasMany(() => Produto)
  products!: Produto[];  // Associação com o modelo Product
}
