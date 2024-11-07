import { Table, Column, Model, DataType, HasMany, AllowNull } from 'sequelize-typescript';

@Table({
    tableName: "Registros",
    timestamps: false
})

export class Registros extends Model{
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Registro_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    Registro_Mensagem!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    Registro_Data!: Date;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    Registro_Repsonsavel!: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    Registro_Tipo!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    Registro_Chave!: number;

    @Column({
        type: DataType.FLOAT
    })
    Registro_ValorTotal: number
}