import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.VITE_DATABASE_URL);

const ensureTable = async () => {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    } catch (error) {
        console.error('Failed to create table:', error);
    }
};

export const saveMessage = async (role: string, content: string) => {
    try {
        await ensureTable();
        await sql`
      INSERT INTO chat_history (role, content)
      VALUES (${role}, ${content})
    `;
    } catch (error) {
        console.error('Database error in saveMessage:', error);
    }
};

export const getHistory = async () => {
    try {
        await ensureTable();
        const result = await sql`SELECT * FROM chat_history ORDER BY created_at ASC LIMIT 50`;
        return result;
    } catch (error) {
        // If table still doesn't exist or other error
        console.warn('Database connection warning (getHistory):', error);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await sql`DELETE FROM chat_history`;
    } catch (error) {
        console.error('Database error in clearHistory:', error);
    }
};
