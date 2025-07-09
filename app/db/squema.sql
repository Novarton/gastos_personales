-- db/schema.sql

CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  color TEXT,
  icono TEXT,
  tipo TEXT NOT NULL
);

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

CREATE TABLE IF NOT EXISTS presupuesto (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mes TEXT NOT NULL,
  monto REAL NOT NULL,
  creado_en TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  pin TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
