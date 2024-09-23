import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Usuario } from './Usuario';

@Table({
    tableName: 'Cargo',
    timestamps: true,
})
export class Cargo extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    cargo_id!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    perfil_email!: string;

    @HasMany(() => Usuario)
    usuario!: Usuario[];
}