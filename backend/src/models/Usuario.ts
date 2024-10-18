import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Cargo } from './Cargo';
import { Entrada } from './Entrada';
import { Saida } from './Saida';

@Table({
    tableName: 'Usuario',
    timestamps: false
})

export class Usuario extends Model {
    
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Usuario_id!: number;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    Usuario_email!: string;

    @Column({
        type: DataType.STRING(60),
        allowNull: false
    })
    Usuario_senha!: string;
    
    @Column({
        type: DataType.STRING(60),
        allowNull: false
    })
    Usuario_nome!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    Usuario_status!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    Usuario_dataCriacao!: Date;

    @ForeignKey(() => Cargo)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    Cargo_id!: number;

    @BelongsTo(() => Cargo)
    Cargo!: Cargo;

    @HasMany (() => Entrada)
    Entradas!: Entrada[]

    @HasMany(() => Saida)
    Saidas!: Saida[]
}