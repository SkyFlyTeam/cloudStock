import { Table, Column, Model, DataType, ForeignKey} from 'sequelize-typescript';
import { Fornecedores } from './Fornecedor';
import { Produto } from './Produto';

@Table({
    tableName: 'Fornecedores_Produto',
    timestamps: false,
})
export class Fornecedores_Produto extends Model<Fornecedores_Produto> {

    @ForeignKey(() => Fornecedores)
    @Column({
        type: DataType.INTEGER,
        allowNull:false,
    })
    Forn_id: number;

    @ForeignKey(() => Produto)
    @Column({
        type: DataType.INTEGER,
        allowNull:false,
    })
    Prod_cod!: number;
}