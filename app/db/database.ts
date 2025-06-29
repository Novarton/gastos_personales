import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('gastos.db');

// Inicialización automática de las tablas
export const initDatabase = () => {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descripcion TEXT NOT NULL,
      cantidad REAL NOT NULL,
      categoria TEXT,
      fecha TEXT DEFAULT (datetime('now'))
    );`
  );

  db.execSync(
    `CREATE TABLE IF NOT EXISTS presupuesto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monto REAL NOT NULL,
      mes TEXT NOT NULL UNIQUE
    );`
  );

  db.execSync(
    `CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE
    );`
  );
};

export default db;
