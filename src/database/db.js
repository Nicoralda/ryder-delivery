/*import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ryders.db');

const execSqlAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          // devuelve false para indicar que la transacción no debe revertirse
          reject(error);
          return false;
        }
      );
    }, (txError) => {
      reject(txError);
    });
  });
};

export const initDB = async () => {
  try {
    await execSqlAsync(
      `CREATE TABLE IF NOT EXISTS session (
        uid TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        fullName TEXT,
        role TEXT NOT NULL
      );`
    );
    console.log("SQLite: tabla 'session' inicializada exitosamente");
    return true;
  } catch (error) {
    console.error("SQLite ERROR: fallo al crear la tabla 'session':", error);
    throw error;
  }
};

export const saveSession = async (uid, email, fullName, role) => {
  try {
    await execSqlAsync(
      'INSERT OR REPLACE INTO session (uid, email, fullName, role) VALUES (?, ?, ?, ?);',
      [uid, email, fullName, role]
    );
    return true;
  } catch (error) {
    console.error("SQLite ERROR: fallo al guardar sesión:", error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const result = await execSqlAsync('SELECT * FROM session LIMIT 1;');
    // result.rows is un objeto tipo { length, item(i) }
    const rows = result.rows;
    if (rows.length > 0) {
      const row = rows.item(0);
      return row;
    }
    return null;
  } catch (error) {
    console.error("SQLite ERROR: Fallo al obtener sesión:", error);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await execSqlAsync('DELETE FROM session;');
    return true;
  } catch (error) {
    console.error("SQLite ERROR: Fallo al limpiar sesión:", error);
    throw error;
  }
};*/
