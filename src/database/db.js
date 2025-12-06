import * as SQLite from 'expo-sqlite';

const DB_NAME = 'ryders.db';
let dbInstance = null; // Variable para almacenar la instancia de la base de datos

// Función para obtener la instancia única de la DB
const getDB = async () => {
    if (dbInstance === null) {
        dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    }
    return dbInstance;
};

export const initDB = async () => {
    try {
        // Usa getDB para obtener/inicializar la instancia
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
        // En caso de fallo en la inicialización, limpia la instancia
        dbInstance = null; 
        console.error("SQLite Error (initDB):", error);
    }
};

export const saveSession = async (uid, email, fullName, role) => {
    try {
        const db = await getDB(); // Ahora usa la instancia persistente
        await db.runAsync(
            'INSERT OR REPLACE INTO session (uid, email, fullName, role) VALUES (?, ?, ?, ?);',
            [uid, email, fullName, role]
        );
        console.log("SQLite: sesión guardada");
    } catch (error) {
        console.error("SQLite Error (saveSession):", error);
        // Opcional: Relanzar el error para que el componente UI lo maneje
        throw error;
    }
};

export const getSession = async () => {
    try {
        const db = await getDB(); // Ahora usa la instancia persistente
        const result = await db.getFirstAsync('SELECT * FROM session LIMIT 1;');
        return result;
    } catch (error) {
        console.error("SQLite Error (getSession):", error);
        return null;
    }
};

export const clearSession = async () => {
    try {
        // La conexión debería estar abierta, si falla aquí, el problema es grave.
        const db = await getDB(); 
        await db.runAsync('DELETE FROM session;');
        console.log("SQLite: sesión eliminada");
        // Opcional: Forzar el cierre de la conexión después de cerrar sesión
        // if (dbInstance) {
        //     await dbInstance.closeAsync();
        //     dbInstance = null;
        // }
    } catch (error) {
        console.error("SQLite Error (clearSession):", error);
        // Opcional: Relanzar el error
        throw error; 
    }
};