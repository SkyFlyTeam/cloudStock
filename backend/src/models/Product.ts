import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Supplier } from './Supplier';  // Importar o modelo Supplier

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @ForeignKey(() => Supplier)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  supplierId!: number;

  // Definir a associação de BelongsTo
  @BelongsTo(() => Supplier)
  supplier!: Supplier;  // Associação com o modelo Supplier
}
