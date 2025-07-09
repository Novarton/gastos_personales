// db/transacciones.ts
import db from './database';

export interface Transaccion {
  id: number;
  tipo: 'ingreso' | 'gasto';
  cantidad: number;
  descripcion: string;
  metodo_pago: string;
  fecha: string;
  categoria_id: number;
  categoria_nombre?: string;
  color?: string;
  icono?: string;
}

export const insertarTransaccion = (
  tipo: 'ingreso' | 'gasto',
  cantidad: number,
  descripcion: string,
  metodoPago: string,
  categoriaId: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transactionSync(tx => {
      tx.executeSql(
        `INSERT INTO transacciones (tipo, cantidad, descripcion, metodo_pago, categoria_id) VALUES (?, ?, ?, ?, ?)`,
        [tipo, cantidad, descripcion, metodoPago, categoriaId],
        () => resolve(),
        (_, error) => {
          console.error('Error insertando transacción:', error);
          reject(error);
          return true;
        }
      );
    });
  });
};

export const obtenerTransaccionesPorMes = (mes: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transactionSync(tx => {
      tx.executeSql(
        `SELECT t.*, c.nombre AS categoria_nombre, c.color, c.icono
         FROM transacciones t
         LEFT JOIN categorias c ON t.categoria_id = c.id
         WHERE strftime('%m-%Y', t.fecha) = ?`,
        [mes],
        (_, { rows }) => resolve(rows._array),
        (_, error) => {
          console.error('Error obteniendo transacciones:', error);
          reject(error);
          return true;
        }
      );
    });
  });
};
