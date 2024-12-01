import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsToMany,
  HasMany,
  BelongsTo,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript';
import { Produto } from './Produto';
import { Registros } from './Registros';
import { Usuario } from './Usuario';

@Table({
  tableName: 'Categoria',
  timestamps: false,
})
export class Categoria extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  Categoria_id!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  Categoria_nome!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  Categoria_status!: boolean;

  @ForeignKey(() => Categoria)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  Categoria_pai!: number;

  @BelongsTo(() => Categoria, 'Categoria_pai')
  categoriaPai?: Categoria;

  @HasMany(() => Categoria, 'Categoria_pai')
  subcategorias!: Categoria[];

  @HasMany(() => Produto)
  Produtos!: Produto[];

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.INTEGER,
    allowNull: true, // Tornar opcional
  })
  Usuario_id!: number | null;

  @AfterCreate
  static async afterCreateHook(instance: Categoria) {
    try {
      const usuario_id = instance.getDataValue('usuario_id');
      console.log(usuario_id)
      const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
      const jsonData = await nome.json();

      await Registros.create({
        Registro_Mensagem: `Nova categoria criada: ${instance.Categoria_nome}`,
        Registro_Data: new Date(),
        Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
        Registro_Tipo: 'Categoria',
        Registro_Chave: instance.Categoria_id,
        Registro_ValorTotal: null,
      });
    } catch (error) {
      console.error('Erro ao registrar criação de categoria:', error);
    }
  }

  @AfterUpdate
  static async afterUpdateHook(instance: Categoria) {
    try {
      const usuario_id = instance.getDataValue('usuario_id');
      console.log(usuario_id)
      const nome = await fetch(`http://localhost:5000/usuario/${usuario_id}`);
      const jsonData = await nome.json();

      // Verifica mudanças no nome
      if (instance.changed('Categoria_nome')) {
        const nomeAntigo = instance.previous('Categoria_nome') as string;

        await Registros.create({
          Registro_Mensagem: `Categoria alterada: ${nomeAntigo} renomeada para ${instance.Categoria_nome}`,
          Registro_Data: new Date(),
          Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
          Registro_Tipo: 'Categoria',
          Registro_Chave: instance.Categoria_id,
          Registro_ValorTotal: null,
        });
      }

      // Verifica mudanças na categoria pai
      if (instance.changed('Categoria_pai')) {
        const categoriaPaiAntigaId = instance.previous('Categoria_pai') as number | null;
        const categoriaPaiNovaId = instance.Categoria_pai;

        // Ignorar registro se a categoria pai antiga for null e a nova for igual ao ID atual (criação)
        if (!categoriaPaiAntigaId && categoriaPaiNovaId === instance.Categoria_id) {
          return;
        }

        // Ignorar registro se a categoria pai antiga e nova forem nulas
        if (!categoriaPaiAntigaId && !categoriaPaiNovaId) {
          return;
        }

        // Busca os nomes das categorias pai antiga e nova
        const categoriaPaiAntiga = categoriaPaiAntigaId
          ? await Categoria.findByPk(categoriaPaiAntigaId)
          : null;
        const categoriaPaiNova = categoriaPaiNovaId
          ? await Categoria.findByPk(categoriaPaiNovaId)
          : null;

        const nomeCategoriaPaiAntiga = categoriaPaiAntiga
          ? categoriaPaiAntiga.Categoria_nome
          : 'Sem categoria pai';
        const nomeCategoriaPaiNova = categoriaPaiNova
          ? categoriaPaiNova.Categoria_nome
          : 'Sem categoria pai';

        // Criar registro apenas se houver uma alteração válida
        if (nomeCategoriaPaiAntiga !== nomeCategoriaPaiNova) {
          await Registros.create({
            Registro_Mensagem: `Categoria "${instance.Categoria_nome}" teve a categoria pai alterada: "${nomeCategoriaPaiAntiga}" para "${nomeCategoriaPaiNova}"`,
            Registro_Data: new Date(),
            Registro_Repsonsavel: `${jsonData.Usuario_nome}`,
            Registro_Tipo: 'Categoria',
            Registro_Chave: instance.Categoria_id,
            Registro_ValorTotal: null,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao registrar atualização de categoria:', error);
    }
  }

}
