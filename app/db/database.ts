// db/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('gastos.db'); // Cambia aquí

// Inicializa las tablas si no existen
export const initDatabase = () => {
  db.transactionSync(tx => {
    // Tabla de categorías
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        color TEXT,
        icono TEXT,
        tipo TEXT NOT NULL -- 'ingreso' o 'gasto'
      );
    `,
      [],
      () => {},
      (_, error) => { console.error(error); return false; }
    );

    // Tabla de transacciones
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        cantidad REAL NOT NULL,
        descripcion TEXT,
        metodo_pago TEXT,
        fecha TEXT DEFAULT (datetime('now')),
        categoria_id INTEGER,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      );
    `,
      [],
      () => {},
      (_, error) => { console.error(error); return false; }
    );

    // Tabla de presupuestos por mes
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS presupuesto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mes TEXT NOT NULL, -- formato MM-YYYY
        monto REAL NOT NULL,
        creado_en TEXT DEFAULT (datetime('now'))
      );
    `,
      [],
      () => {},
      (_, error) => { console.error(error); return false; }
    );

    // Tabla usuario (opcional)
    tx.executeSql(
      `
      CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        pin TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `,
      [],
      () => {},
      (_, error) => { console.error(error); return false; }
    );
  });
};

export default db;
