import { Router, Request, Response } from 'express';
const mysql = require('mysql2');

const router = Router();

// Rota para verificar se o servidor está rodando
router.get('/', (req, res) => {
    return res.json('Bem vindo ao Back-End');
});

router.get('/elementos', (req, res) => {
    const conn = mysql.createConnection({
        user: 'root',
        host: 'localhost',
        password: 'password', // modifique a senha
        database: 'database' // selecione a base de dados
    });
    const sql = 'select p.pro_nome, p.pro_valor, f.func_nome from produto p join fornecedor f on p.func_id=f.func_id;'; // Consulta que deseja
    
    conn.connect((err) => {
        if (err) throw err;
        conn.query(sql, (err, result) => {
            if (err) throw err;
            console.log(result);
            return res.json(result);
        });
    });
});

export default router;