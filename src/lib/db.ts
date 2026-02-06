import { neon } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const sql = isValidUrl(DATABASE_URL) ? neon(DATABASE_URL) : null;


const ensureTable = async () => {
    if (!sql) {
        console.warn('Database SQL client not initialized. Check VITE_DATABASE_URL.');
        return;
    }
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
    if (!sql) return;
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
    if (!sql) return [];
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
    if (!sql) return;
    try {
        await sql`DELETE FROM chat_history`;
    } catch (error) {
        console.error('Database error in clearHistory:', error);
    }
};
