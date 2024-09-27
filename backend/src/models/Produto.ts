import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey, BelongsToMany, HasMany, AutoIncrement } from 'sequelize-typescript';
import { Fornecedor_Produto } from './Fornecedor_Produto';
import { ManyToMany } from 'typeorm';
import { Lote } from './Lote';
import { Categoria } from './Categoria';
import { Unidade_Medida } from './Unidade_Medida';
import { Fornecedor } from './Fornecedor';

@Table({
    tableName: 'Produto',
    timestamps: false
})

export class Produto extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Prod_cod!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    Prod_nome!: string;

    @Column({
       type: DataType.STRING,
       allowNull: false
    })
    Prod_descricao?: string;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: false
    })
    Prod_preco!: number;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: false
    })
    Prod_custo!: number;

    @Column({
        type: DataType.BLOB('medium'),
        allowNull: true
    })
    Prod_imagem?: Buffer;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: true
    })
    Prod_peso?: number;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: true
    })
    Prod_altura?: number;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: true
    })
    Prod_largura?: number;

    @Column({
        type: DataType.DECIMAL(8,2),
        allowNull: true
    })
    Prod_comprimento?: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    Prod_marca?: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    Prod_modelo?: string;

    @Column({
        type: DataType.DATE, 
        allowNull: true, 
      })
      Prod_validade?: Date

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    Prod_status!: boolean;

    @ForeignKey(() => Categoria)
    @Column({
      type: DataType.INTEGER,
      allowNull: true
    })
    Categoria_id!: number

    @BelongsTo(() => Categoria)  
    Categoria!: Categoria;

    @ForeignKey(() => Unidade_Medida)
    @Column({
      type: DataType.INTEGER,
      allowNull: true
    })
    UnidadeMedida_id!: number

    @BelongsTo(() => Unidade_Medida)
    Unidade_Medida!: Unidade_Medida

    @BelongsToMany(() => Fornecedor, () => Fornecedor_Produto)
    Fornecedores!: Fornecedor[];

    @HasMany(() => Lote)
    Lotes!: Lote[]
}
