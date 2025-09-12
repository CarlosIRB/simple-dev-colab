// Biblioteca de acceso a datos inicial. Sustituir por cliente real (p.ej. Prisma/Knex).
export type DatabaseClient = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export const db: DatabaseClient = {
  async connect() {
    // NOTE: replace with real connection logic
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DB] connect (stub)');
    }
  },
  async disconnect() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DB] disconnect (stub)');
    }
  },
};
