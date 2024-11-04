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
import dotenv from 'dotenv';
import { Registros } from '../models/Registros';
import { ConfigSistema } from '../models/ConfigSistema';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  models: [Cargo, Categoria, Entrada, Fornecedor_Produto, Fornecedor, Local_Armazenamento, Lote_Entrada, Lote_Saida, Lote, Produto, Saida, Setor, Unidade_Medida, Usuario, Registros, ConfigSistema],  // Adiciona os modelos aqui
});

export default sequelize;
