import { Router } from 'express';
import entradaRoutes from './entradaRoutes'
import produtoRoutes from './produtoRoutes';
import loteRoutes from './loteRoutes';
import saidaRoutes from './saidaRoutes'
import cargoRoutes from './cargoRoutes';
import usuarioRoutes from './usuarioRoutes';
import categoriaRoutes from './categoriaRoutes';
import fornecedorRoutes from './fornecedorRoutes';
import unidadeMedidaRoutes from './unidadeMedidaRoutes';
import localArmazenamentoRoutes from './localArmazenamentoRoutes';
import setorRoutes from './setorRoutes';
import registroRoutes from './registrosRoutes';
import authRoutes from './authRoutes'
import loteEntradaRoutes from './loteEntradaRoutes';
import loteSaidaRoutes from './loteSaidaRoutes';
import configRoutes from './configRoutes';
import notificacoesRoutes from './notificacoesRoutes';

const router = Router();

// Rota para Cargo
router.use('/cargo', cargoRoutes)

// Rota para Usuario
router.use('/usuario', usuarioRoutes)

// Rota para Entrada
router.use('/entrada', entradaRoutes)

// Rota para Produto
router.use('/produto', produtoRoutes);

// Rota para Categoria
router.use('/categoria', categoriaRoutes);

// Rota para Fornecedores
router.use('/fornecedor', fornecedorRoutes);

// Rota para Lote
router.use('/lote', loteRoutes);

// Rota para Saída
router.use('/saida', saidaRoutes);

// Rota para UnidadeMedida
router.use('/unidademedida', unidadeMedidaRoutes);

// Rota para LocalArmazenamento
router.use('/localarmazenamento', localArmazenamentoRoutes);

// Rota para Setor
router.use('/setor', setorRoutes);

//Rota para Registros
router.use('/registros', registroRoutes);

//Rota para Autenticação
router.use('/auth', authRoutes);

//Rota para Lote Entrada
router.use('/loteEntrada', loteEntradaRoutes);

//Rota para lote Saida
router.use('/loteSaida', loteSaidaRoutes );

//Rota para configurações de sistema
router.use('/configsistema', configRoutes)

//Rota para notificações
router.use('/notificacoes', notificacoesRoutes)


export default router;