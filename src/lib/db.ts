import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ DB connected at:', result.rows[0].now)
  } catch (err) {
    console.error('❌ DB connection error:', err)
  }
}

export default pool
