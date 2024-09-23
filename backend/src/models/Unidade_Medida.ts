import { Table, Column, Model, DataType} from 'sequelize-typescript';

@Table ({
    tableName: "Fornecedores",
    timestamps: false,
})
export class Unidade_Medida extends Model <Unidade_Medida> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
    })
    UnidadeMedida_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    UnidadeMedida_nome!: string;
}