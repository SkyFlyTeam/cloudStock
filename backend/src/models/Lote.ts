import { Table, Column, Model, DataType, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Lote_Entrada } from './Lote_Entrada';
import { Entrada } from './Entrada';
import { DateOnlyDataType } from 'sequelize';
import { Produto } from './Produto';
import { Local_Armazenamento } from './Local_Armazenamento';
import { Saida } from './Saida';
import { Lote_Saida } from './Lote_Saida';
import { Fornecedor } from './Fornecedor';

@Table({
    tableName: 'Lote',
    timestamps: false
})

export class Lote extends Model {

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true, 
        primaryKey: true
    })
    Lote_id!: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true
    })
    Lote_validade!: Date;

    @Column({
        type: DataType.INTEGER,
    })
    Lote_quantidade!: number;

    @Column({
        type: DataType.STRING(30),
    })
    Lote_cod!: string;

    @ForeignKey(() => Produto)
    @Column({
        type: DataType.INTEGER,
    })
    Prod_cod!: number;

    @ForeignKey(() => Local_Armazenamento)
    @Column({
        type: DataType.INTEGER,
    })
    LocAr_id!: number;

    @ForeignKey(() => Fornecedor)
    @Column({
        type: DataType.INTEGER,
    })
    Forn_id!: number;


    //Cardinalidades
    @BelongsTo(() => Produto)
    Produtos!: Produto[]

    @BelongsTo(() => Local_Armazenamento)
    Locais_Armazenamento!: Local_Armazenamento[]

    @BelongsTo(() => Fornecedor)
    Fornecedores!: Fornecedor[]

    // Associação com Entrada através de LoteEntrada
    @BelongsToMany(() => Entrada, () => Lote_Entrada)
    Entradas!: Entrada[];

    @BelongsToMany(() => Saida, () => Lote_Saida)
    Saidas!: Saida[];   
}
