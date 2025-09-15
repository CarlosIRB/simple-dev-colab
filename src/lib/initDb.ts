import pool from './db'
import fs from 'fs'
import path from 'path'

export async function initDb() {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';`
    )
    if (parseInt(res.rows[0].count) === 0) {
      const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql')
      const schema = fs.readFileSync(schemaPath, 'utf-8')
      await client.query(schema)
      console.log('✅ Base de datos inicializada')
    } else {
      console.log('ℹ️ La base de datos ya tiene tablas, no se inicializa')
    }
  } finally {
    client.release()
  }
}
