import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    AfterCreate,
    AfterUpdate,
  } from 'sequelize-typescript';
  import { Cargo } from './Cargo';
  import { Entrada } from './Entrada';
  import { Saida } from './Saida';
  import { Registros } from './Registros';
  
  @Table({
    tableName: 'Usuario',
    timestamps: false,
  })
  export class Usuario extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    Usuario_id!: number;
  
    @Column({
      type: DataType.STRING(30),
      allowNull: false,
    })
    Usuario_email!: string;
  
    @Column({
      type: DataType.STRING(60),
      allowNull: false,
    })
    Usuario_senha!: string;
  
    @Column({
      type: DataType.STRING(60),
      allowNull: false,
    })
    Usuario_nome!: string;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
    })
    Usuario_status!: boolean;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
    })
    Usuario_dataCriacao!: Date;

    @Column({
        type: DataType.VIRTUAL, // Define o campo como virtual
    })
    usuario_id!: string; // Tipo do campo (ajuste conforme necessário)
  
    @ForeignKey(() => Cargo)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    Cargo_id!: number;
  
    @BelongsTo(() => Cargo)
    Cargo!: Cargo;
  
    @HasMany(() => Entrada)
    Entradas!: Entrada[];
  
    @HasMany(() => Saida)
    Saidas!: Saida[];
  
    /**
     * Hook para registrar a criação de um novo usuário.
     */
    @AfterCreate
    static async afterCreateHook(instance: Usuario) {
      try {

        const usuario_id = instance.getDataValue('usuario_id');
        console.log(usuario_id)
        const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
        const jsonData = await nome.json();

        await Registros.create({
          Registro_Mensagem: `Novo usuário criado: ${instance.Usuario_nome} (${instance.Usuario_email})`,
          Registro_Data: new Date(),
          Registro_Repsonsavel: `${jsonData.Usuario_nome}`, // Ajuste para incluir o responsável pela criação, se necessário
          Registro_Tipo: 'CREATE',
          Registro_Chave: instance.Usuario_id,
          Registro_ValorTotal: null,
        });
      } catch (error) {
        console.error('Erro ao registrar criação de usuário:', error);
      }
    }
  
    /**
     * Hook para registrar alterações no status ou cargo do usuário.
     */
    @AfterUpdate
    static async afterUpdateHook(instance: Usuario, options: any) {
      try {

        const usuario_id = options.context?.usuario_id
        const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
        const jsonData = await nome.json();

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
                        case 'Usuario_email':
                            mensagem = `Usuário "${instance.Usuario_nome}" teve seu e-mail alterado para "${valorNovo}"`
                            valorTotal = null;
                            break;

                        case 'Usuario_senha':
                            mensagem = `Usuário "${instance.Usuario_nome}" teve sua senha alterada`;
                            valorTotal = null;
                            break;

                        case 'Usuario_status':
                            const statusAntigo = valorAntigo ? 'Ativo' : 'Inativo';
                            const statusNovo = valorNovo ? 'Ativo' : 'Inativo';
                            mensagem = `Usuário "${instance.Usuario_nome}" teve o status alterado de "${statusAntigo}" para "${statusNovo}"`;
                            break;

                        default:
                            // Ignora campos não monitorados
                            continue;
                    }

                    // Cria o registro para o campo alterado
                    await Registros.create({
                        Registro_Mensagem: mensagem,
                        Registro_Data: new Date(),
                        Registro_Repsonsavel: `${jsonData.Usuario_nome}`, // Ajuste conforme necessário
                        Registro_Tipo: 'UPDATE',
                        Registro_Chave: instance.Usuario_id,
                        Registro_ValorTotal: valorTotal,
                    });
                }
            }
      } catch (error) {
        console.error('Erro ao registrar atualização de usuário:', error);
      }
    }
  }