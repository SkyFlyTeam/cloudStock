import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LoteEntrada } from './Lote_Entrada';

@Table({
    tableName: 'lote',
    timestamps: false,
})
export class Lote extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true, // Enable auto-increment
        primaryKey: true,    // Set as primary key
    })
    loteId!: number;

    @Column({
        type: DataType.DATE,
    })
    loteValidade!: Date;

    @Column({
        type: DataType.INTEGER,
    })
    loteQuantidade!: number;

    @Column({
        type: DataType.STRING(30),
    })
    loteCod!: string;

    @Column({
        type: DataType.INTEGER,
    })
    ProdutoProdCod!: number;

    @Column({
        type: DataType.INTEGER,
    })
    localArmzLocAirId!: number;
}