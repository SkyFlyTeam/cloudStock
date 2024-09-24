import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Usuario } from './Usuario';

@Table({
    tableName: 'Cargo',
    timestamps: false
})

export class Cargo extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Cargo_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    Cargo_acesso!: string;

    @HasMany(() => Usuario)
    Usuarios!: Usuario[];
}