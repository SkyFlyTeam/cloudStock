import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../models/Produto';
import { Cargo } from '../models/Cargo';
import { Categoria } from '../models/Categoria';
import { Entrada } from '../models/Entrada';
import { Lote } from '../models/Lote';
import { Saida } from '../models/Saida';
import { Setor } from '../models/Setor';
import { Usuario } from '../models/Usuario';
import { Fornecedor } from '../models/Fornecedor';
import { Fornecedor_Produto } from '../models/Fornecedor_Produto';
import { Local_Armazenamento } from '../models/Local_Armazenamento';
import { Lote_Entrada } from '../models/Lote_Entrada';
import { Lote_Saida } from '../models/Lote_Saida';
import { Unidade_Medida } from '../models/Unidade_Medida';

const sequelize = new Sequelize({
  database: 'orm',
  username: 'root',
  password: '', // mudar senha
  host: '', // colocar domínio
  dialect: 'mysql',
  models: [Cargo, Categoria, Entrada, Fornecedor_Produto, Fornecedor, Local_Armazenamento, Lote_Entrada, Lote_Saida, Lote, Produto, Saida, Setor, Unidade_Medida, Usuario],  // Adiciona os modelos aqui
});

export default sequelize;
