import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Produto } from './Produto';
import { Lote } from './Lote';

@Table({
    tableName: 'Notificacoes',
    timestamps: false,
})

export class Notificacoes extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Not_id!: string;

    @Column({
        type: DataType.DATE,  
        allowNull: false
    })
    Not_data!: Date;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    Not_tipo!: string;

	@ForeignKey(() => Produto)
	@Column({
		type: DataType.INTEGER
	})
	Prod_cod!: number;

    @ForeignKey(() => Lote)
    @Column({
        type: DataType.INTEGER,
        allowNull: true 
    })
    Lote_id!: number | null;

	@BelongsTo(() => Produto)
	Produto!: Produto;

    @BelongsTo(() => Lote)
    Lote?: Lote;
}
