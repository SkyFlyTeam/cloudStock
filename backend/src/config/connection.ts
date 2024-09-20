import { Sequelize } from 'sequelize-typescript';
import { Produto } from '../models/Produto';
import { Supplier } from '../models/Supplier';

const sequelize = new Sequelize({
  database: 'orm',
  username: 'root',
  password: '', // mudar senha
  host: '', // colocar domínio
  dialect: 'mysql',
  models: [Product, Supplier],  // Adiciona os modelos aqui
});

export default sequelize;
