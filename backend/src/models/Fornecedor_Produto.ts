import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Fornecedor } from './Fornecedor';
import { Produto } from './Produto';

@Table({
    tableName: 'Fornecedor_Produto',
    timestamps: false
})

export class Fornecedor_Produto extends Model {

    @ForeignKey(() => Fornecedor)
    @Column({
        type: DataType.INTEGER
    })
    Forn_id: number;

    @ForeignKey(() => Produto)
    @Column({
        type: DataType.INTEGER,
    })
    Prod_cod!: number;
}