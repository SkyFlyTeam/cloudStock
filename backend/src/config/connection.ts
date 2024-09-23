import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../models/Produto';
import { Usuario } from '../models/Usuario';
import { Cargo } from '../models/Cargo';

const sequelize = new Sequelize({
  database: 'orm',
  username: 'root',
  password: '', // mudar senha
  host: '', // colocar domínio
  dialect: 'mysql',
  models: [Produto, Usuario],  // Adiciona os modelos aqui
});

export default sequelize;
