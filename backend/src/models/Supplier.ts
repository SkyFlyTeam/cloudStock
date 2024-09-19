import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Product } from './Product';  // Importar o modelo Product

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
  @HasMany(() => Product)
  products!: Product[];  // Associação com o modelo Product
}
