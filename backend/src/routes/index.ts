import { Router, Request, Response } from 'express'
import { select } from '../service/selectFrom'
const mysql = require('mysql2/promise')

const router = Router()

// Rota para verificar se o servidor está rodando
router.get('/', (req, res) => {
    return res.json('Bem vindo ao Back-End')
})

router.get('/elementos', async (req, res) => {
    const sql = 'SELECT p.pro_nome, p.pro_valor, f.func_nome FROM produto p JOIN fornecedor f ON p.func_id = f.func_id'
    
    try {
        const result = await select(sql)
        return res.json(result)
    } catch (err) {
        console.error("Error in /elementos route:", err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

export default router