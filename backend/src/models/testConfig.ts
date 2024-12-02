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
import { Notificacoes } from '../models/Notificacoes';

// Configuração de conexão com o banco de dados
dotenv.config();

const sequelize = new Sequelize({
  database: "cloudstock",
  username: "root",
  password: "admin123456",
  host: "localhost",
  port: 3306,
  dialect: 'mysql',
  models: [Cargo, Categoria, Entrada, Fornecedor_Produto, Fornecedor, Local_Armazenamento, Lote_Entrada, Lote_Saida, Lote, Produto, Saida, Setor, Unidade_Medida, Usuario, Registros, ConfigSistema, Notificacoes],  // Adiciona os modelos aqui
});
async function testConfig() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco estabelecida.');

    // Busca a configuração para testar
    const config = await ConfigSistema.findByPk(1);
    if (config) {
      console.log('Configuração encontrada:', config);
      config.Config_avisoValidade = 30; // Novo valor para o aviso de validade
      await config.save();
      console.log('Configuração alterada com sucesso.');
    } else {
      console.log('Nenhuma configuração encontrada.');
    }
  } catch (error) {
    console.error('Erro ao testar ConfigSistema:', error);
  } finally {
    await sequelize.close();
  }
}

testConfig();
