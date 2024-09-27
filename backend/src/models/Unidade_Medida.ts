import { Table, Column, Model, DataType, HasMany} from 'sequelize-typescript';
import { Produto } from './Produto';

@Table ({
    tableName: "Unidade_Medida",
    timestamps: false
})

export class Unidade_Medida extends Model {
    
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    UnidadeMedida_id!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    UnidadeMedida_nome!: string;

    @HasMany(() => Produto)
    Produtos!: Produto[]
}