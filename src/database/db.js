import * as SQLite from 'expo-sqlite';

const DB_NAME = 'ryders.db';
let dbInstance = null;

const getDB = async () => {
    if (dbInstance === null) {
        dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    }
    return dbInstance;
};

export const initDB = async () => {
    try {
        const db = await getDB(); 
        
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS session (
                uid TEXT PRIMARY KEY NOT NULL,
                email TEXT NOT NULL,
                fullName TEXT,
                role TEXT NOT NULL
            );
        `);
        console.log("SQLite: tabla inicializada correctamente");
    } catch (error) {
        dbInstance = null; 
        console.error("SQLite Error (initDB):", error);
    }
};

export const saveSession = async (uid, email, fullName, role) => {
    try {
        const db = await getDB();
        await db.runAsync(
            'INSERT OR REPLACE INTO session (uid, email, fullName, role) VALUES (?, ?, ?, ?);',
            [uid, email, fullName, role]
        );
        console.log("SQLite: sesión guardada");
    } catch (error) {
        console.error("SQLite Error (saveSession):", error);
        throw error;
    }
};

export const getSession = async () => {
    try {
        const db = await getDB();
        const result = await db.getFirstAsync('SELECT * FROM session LIMIT 1;');
        return result;
    } catch (error) {
        console.error("SQLite Error (getSession):", error);
        return null;
    }
};

export const clearSession = async () => {
    try {
        const db = await getDB(); 
        await db.runAsync('DELETE FROM session;');
        console.log("SQLite: sesión eliminada");

    } catch (error) {
        console.error("SQLite Error (clearSession):", error);
        throw error; 
    }
};