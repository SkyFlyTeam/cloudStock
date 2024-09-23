import { Table, Column, Model, DataType} from 'sequelize-typescript';

@Table({
    tableName: 'Fornecedores',
    timestamps: false,
})
export class Fornecedores extends Model<Fornecedores> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, //habilita autoincrement
    })
    Forn_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    Forn_nome!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    Forn_razaosocial!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    Forn_cnpj!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    Forn_status!: boolean // propriedade para o status (ativo/inativo)

    // fornecedores!:Fornecedores
}


