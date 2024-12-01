import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany, HasMany, AfterCreate, AfterUpdate } from 'sequelize-typescript';
import { Fornecedor_Produto } from './Fornecedor_Produto';
import { Lote } from './Lote';
import { Categoria } from './Categoria';
import { Unidade_Medida } from './Unidade_Medida';
import { Fornecedor } from './Fornecedor';
import { Notificacoes } from './Notificacoes';
import { Registros } from './Registros';

@Table({
    tableName: 'Produto',
    timestamps: false
})
export class Produto extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    Prod_cod!: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    Prod_nome!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    Prod_descricao?: string;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false
    })
    Prod_preco!: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: false
    })
    Prod_custo!: number;

    @Column({
        type: DataType.BLOB('medium'),
        allowNull: true
    })
    Prod_imagem?: Buffer | null;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true
    })
    Prod_peso?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true
    })
    Prod_altura?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true
    })
    Prod_largura?: number;

    @Column({
        type: DataType.DECIMAL(8, 2),
        allowNull: true
    })
    Prod_comprimento?: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    Prod_marca?: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: true
    })
    Prod_modelo?: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    Prod_validade?: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    Prod_status!: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    Prod_estoqueMinimo!: number;

    @ForeignKey(() => Categoria)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    Categoria_id!: number;

    @BelongsTo(() => Categoria)
    Categoria!: Categoria;

    @ForeignKey(() => Unidade_Medida)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    UnidadeMedida_id!: number;

    @BelongsTo(() => Unidade_Medida)
    Unidade_Medida!: Unidade_Medida;

    @BelongsToMany(() => Fornecedor, () => Fornecedor_Produto)
    Fornecedores!: Fornecedor[];

    @HasMany(() => Lote)
    Lotes!: Lote[];

    @HasMany(() => Notificacoes)
    Notificacoes!: Notificacoes[];

    // Hook para registrar criação
    @AfterCreate
    static async registrarCriacao(instance: Produto) {
        try {

            // Substitua "produto" pelo endpoint correto para buscar o responsável
            // const response = await fetch(`http://localhost:5000/usuario/produto/${instance.Prod_cod}`);
            // const jsonData = await response.json();


            await Registros.create({
                Registro_Mensagem: `Produto criado: ID ${instance.Prod_cod}, Nome: ${instance.Prod_nome}`,
                Registro_Data: new Date(),
                Registro_Repsonsavel: "Sistema", // Ajuste conforme necessidade
                Registro_Tipo: 'CREATE',
                Registro_Chave: instance.Prod_cod,
                Registro_ValorTotal: instance.Prod_preco,
            });
        } catch (error) {
            console.error('Erro ao registrar criação de produto:', error);
        }
    }

    // Hook para registrar alterações
    @AfterUpdate
    static async registrarAlteracao(instance: Produto) {
        try {

            // const response = await fetch(`http://localhost:5000/usuario/produto/${instance.Prod_cod}`);
            // const jsonData = await response.json();
            // const responsavel = jsonData.Usuario_nome


            // Verifica mudanças no preço
            // Obtém os campos alterados
        const camposAlterados = instance.changed() || [];

        // Itera sobre os campos alterados para verificar o que realmente mudou
        for (const campo of camposAlterados) {
            const valorAntigo = instance.previous(campo);
            const valorNovo = (instance as any)[campo];

            // Verifica se o valor antigo é diferente do novo
            if (valorAntigo != valorNovo) {
                let mensagem = '';
                let valorTotal = null;

                // Define mensagens específicas para cada campo
                switch (campo) {
                    case 'Prod_preco':
                        mensagem = `Produto "${instance.Prod_nome}" teve o preço alterado de R$${Number(valorAntigo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para R$${Number(valorNovo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                        valorTotal = valorNovo;
                        break;

                    case 'Prod_custo':
                        mensagem = `Produto "${instance.Prod_nome}" teve o custo alterado de R$${Number(valorAntigo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para R$${Number(valorNovo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                        valorTotal = valorNovo;
                        break;

                    case 'Categoria_id':
                        mensagem = `Produto "${instance.Prod_nome}" teve a categoria alterada de ${valorAntigo ?? 'não definida'} para ${valorNovo ?? 'não definida'}`;
                        break;

                    case 'Prod_estoqueMinimo':
                        mensagem = `Produto "${instance.Prod_nome}" teve o estoque mínimo alterado de ${valorAntigo} para ${valorNovo}`;
                        break;

                    case 'Prod_status':
                        const statusAntigo = valorAntigo ? 'Ativo' : 'Inativo';
                        const statusNovo = valorNovo ? 'Ativo' : 'Inativo';
                        mensagem = `Produto "${instance.Prod_nome}" teve o status alterado de "${statusAntigo}" para "${statusNovo}"`;
                        break;

                    default:
                        // Ignora campos não monitorados
                        continue;
                }

                // Cria o registro para o campo alterado
                await Registros.create({
                    Registro_Mensagem: mensagem,
                    Registro_Data: new Date(),
                    Registro_Repsonsavel: 'Sistema', // Ajuste conforme necessário
                    Registro_Tipo: 'UPDATE',
                    Registro_Chave: instance.Prod_cod,
                    Registro_ValorTotal: valorTotal,
                });
            }
        }
    } catch (error) {
        console.error('Erro ao registrar alterações no produto:', error);
    }
    }



}
