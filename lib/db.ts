// @ts-ignore
import Database from 'better-sqlite3';

const db = new Database('accesos.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS accesos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    fecha TEXT NOT NULL
  )
`);

export default db; 