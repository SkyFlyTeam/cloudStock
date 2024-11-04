import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';

@Table({
    tableName: 'ConfigSistema',
    timestamps: false
})

export class ConfigSistema extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Config_id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })

    Config_estoqueMinimo!: number;
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    Config_avisoValidade!: number;
}