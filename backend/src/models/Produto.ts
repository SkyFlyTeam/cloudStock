import { Table, Column, Model, DataType, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'Produto',
  timestamps: true,
})

export class Produto extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
    })
    prod_cod!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    prod_nome!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    prod_descricao?: string;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false,
    })
    prod_preco!: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false,
    })
    prod_custo!: number;

    @Column({
        type: DataType.BLOB('medium'),
        allowNull: true,
    })
    prod_imagem?: Buffer;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true,
    })
    prod_peso?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true,
    })
    prod_altura?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false,
    })
    prod_largura?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true,
    })
    prod_comprimento?: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    prod_marca?: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    prod_modelo?: string;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false,
    })
    prod_validade!: boolean;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    prod_status!: boolean;

    /* Adicionar após as classes Categoria, Unidade de Medida e Fornecedor serem criadas */
    // @ForeignKey(() => Categoria)
    // @Column({
    //   type: DataType.INTEGER,
    //   allowNull: true,
    // })
    // categoriaId!: number

    // @BelongsToMany(() => Categoria, {
    //    through: () => ProdutoCategoria, // Especifica a tabela intermediária
    //  })
    //  declare categorias?: NonAttribute<Categoria[]>; //Indica apenas a relação, sem criar uma coluna no db

    // @ForeignKey(() => UnidadeMedida)
    // @Column({
    //   type: DataType.INTEGER,
    //   allowNull: false,
    // })
    // unidadeMedida_id!: number
  
    // @BelongsTo(() => UnidadeMedida)
    // unidadeMedida!: UnidadeMedida

    // @BelongsToMany(() => Fornecedor, {
    //    through: () => FornecedoresProduto, // Especifica a tabela intermediária
    //  })
    //  declare fornecedores?: NonAttribute<Fornecedor[]>; //Indica apenas a relação, sem criar uma coluna no db
}
