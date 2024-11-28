import {
    Table,
    Column,
    Model,
    DataType,
    AfterUpdate,
  } from 'sequelize-typescript';
  import { Registros } from './Registros';
  
  @Table({
    tableName: 'ConfigSistema',
    timestamps: false,
  })
  export class ConfigSistema extends Model {
    @Column({
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    })
    Config_id!: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    Config_avisoValidade!: number;
  
    /**
     * Hook após atualização de Config_avisoValidade
     */
    @AfterUpdate
    static async afterUpdateHook(instance: ConfigSistema) {
      try {

        if (instance.changed('Config_avisoValidade')) {
          const antigoValor = instance.previous('Config_avisoValidade') as number;
          const novoValor = instance.Config_avisoValidade;
  

          await Registros.create({
            Registro_Mensagem: `Configuração de aviso de validade alterada: ${antigoValor} dias para ${novoValor} dias`,
            Registro_Data: new Date(),
            Registro_Responsavel: 'Sistema',
            Registro_Tipo: 'Sistema',
            Registro_Chave: instance.Config_id,
            Registro_ValorTotal: null,
          });
        }
      } catch (error) {
        console.error('Erro ao registrar alteração de Config_avisoValidade:', error);
      }
    }
  }
  