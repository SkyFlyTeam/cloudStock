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
    user_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    user_email!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    price!: number;

    @ForeignKey(() => Cargo) 
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    cargo_id!: number;

    @BelongsTo(() => Cargo)
    cargo!: Cargo;
}