import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../models/Produto';
import { Supplier } from '../models/Supplier';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'orm',
  models: [Produto, Supplier],  // Adiciona os modelos aqui
});

export default sequelize;
