import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Fornecedor_Produto } from './Fornecedor_Produto';
import { Produto } from './Produto';

@Table({
    tableName: 'Fornecedor',
    timestamps: false
})

export class Fornecedor extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Forn_id!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    Forn_nome!: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: true
    })
    Forn_razaoSocial!: string;

    @Column({
        type: DataType.STRING(18),
        allowNull: true
    })
    Forn_cnpj!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    Forn_status!: boolean

    @BelongsToMany(() => Produto, () => Fornecedor_Produto)
    Produtos!: Produto[];
}


