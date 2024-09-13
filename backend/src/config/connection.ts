const mysql = require('mysql2/promise')

export async function connection() {
    const conn = await mysql.createConnection({
        user: 'root',
        host: 'localhost',
        password: 'fatec', // senha de seu workbecnh
        database: 'ativ2'  // sua basa de dados
    })
    return conn
}
