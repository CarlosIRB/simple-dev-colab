// src/lib/db.ts
'use server'

import { Pool } from 'pg'
import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';
const auth = new GoogleAuth();

const projectId = await auth.getProjectId();
const connector = new Connector();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

const clientOpts = await connector.getOptions({
  instanceConnectionName: `${projectId}:${requireEnv('DATABASE_INSTANCE')}`,
  authType: AuthTypes.IAM,
});

const pool = new Pool({
  ...clientOpts,
  user: requireEnv('DATABASE_USER'),
  password: requireEnv('DATABASE_PASSWORD'),
  database: requireEnv('DATABASE_NAME'),
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// })

// export async function testConnection() {
//   try {
//     const result = await pool.query('SELECT NOW()')
//     console.log('✅ DB connected at:', result.rows[0].now)
//   } catch (err) {
//     console.error('❌ DB connection error:', err)
//   }
// }

export default pool
