import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Produto } from './Produto';

@Table({
    tableName: 'Notificacao',
    timestamps: false,
})
export class Notificacao extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
        allowNull: false
    })
    not_id!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    not_mensagem!: string;

    @Column({
        type: DataType.DATEONLY,  
        allowNull: false
    })
    not_data!: Date;
    

    @ForeignKey(() => Produto)
    @Column({
        type: DataType.INTEGER,  // Altere para INTEGER para ser compatível com Prod_cod
        allowNull: false
    })
    produtos_id!: number;

    @BelongsTo(() => Produto)
    Produto!: Produto;
}
