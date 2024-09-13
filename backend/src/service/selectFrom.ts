import { connection } from "../config/connection"

export async function select(sql: string) {
    const conn = await connection()
    
    try {
        const [result] = await conn.query(sql)
        // console.log(result)
        return result
    } catch (err) {
        console.error("Error executing query: ", err)
        throw err
    } finally {
        conn.end() 
    }
}
