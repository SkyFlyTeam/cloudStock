import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cargo } from './Cargo';

@Table({
    tableName: 'Usuario',
    timestamps: true,
})
export class Usuario extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    perfil_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    perfil_email!: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: false,
    })
    perfil_senha!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    perfil_CriacaoData!: Date;

    @ForeignKey(() => Cargo)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    cargo_id!: number;

    @BelongsTo(() => Cargo)
    cargo!: Cargo;
}