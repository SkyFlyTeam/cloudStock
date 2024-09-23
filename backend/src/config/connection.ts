import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../models/Produto';

const sequelize = new Sequelize({
  database: 'orm',
  username: 'root',
  password: '', // mudar senha
  host: '', // colocar domínio
  dialect: 'mysql',
  models: [Produto],  // Adiciona os modelos aqui
});

export default sequelize;
