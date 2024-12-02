import {
  Table,
  Column,
  Model,
  DataType,
  AfterUpdate
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

  @AfterUpdate
  static async afterUpdateHook(instance: ConfigSistema, options: any) {
    try {
      if (instance.changed('Config_avisoValidade')) {

        const antigoValor = instance.previous('Config_avisoValidade') as number;
        const novoValor = instance.Config_avisoValidade;

        const usuario_id = options.context?.usuario_id
        const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
        const jsonData = await nome.json();

        await Registros.create({
          Registro_Mensagem: `Configuração de aviso de validade alterada: ${antigoValor} dias para ${novoValor} dias`,
          Registro_Data: new Date(),
          Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
          Registro_Tipo: 'Sistema',
          Registro_Chave: 1,
          Registro_ValorTotal: 0,
        });
      }
    } catch (error) {
      console.error('Erro ao registrar alteração de Config_avisoValidade:', error);
    }
  }
}
