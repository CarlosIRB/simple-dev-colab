// src/lib/db.ts
import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function initDb() {
  const client = await pool.connect()
  try {
    const res = await client.query(
      `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';`
    )

    if (parseInt(res.rows[0].count) === 0) {
      const schemaPath = path.join(process.cwd(), 'schema.sql')
      const schema = fs.readFileSync(schemaPath, 'utf-8')
      await client.query(schema)
      console.log('✅ Base de datos inicializada')
    }
  } catch (err) {
    console.error('❌ Error al inicializar la BD:', err)
  } finally {
    client.release()
  }
}

export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ DB connected at:', result.rows[0].now)
  } catch (err) {
    console.error('❌ DB connection error:', err)
  }
}

initDb().catch(console.error)

export default pool