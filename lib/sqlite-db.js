// lib/sqlite-db.js
/**
 * Gestor de BD SQLite para TableroQA
 * Inicializa BD y proporciona métodos para consultas
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(process.cwd(), 'data', 'tableroqua.db');

// Asegurar que el directorio existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

class DatabaseManager {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Error abriendo BD:', err);
          reject(err);
        } else {
          console.log('✓ BD SQLite inicializada:', DB_PATH);
          this.db.configure('busyTimeout', 5000);
          this.createSchema().then(() => {
            this.initialized = true;
            resolve();
          }).catch(reject);
        }
      });
    });
  }

  createSchema() {
    return new Promise((resolve, reject) => {
      const schema = `
        -- Tabla de BUGS
        CREATE TABLE IF NOT EXISTS bugs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bug_key TEXT UNIQUE,
          bug_id INTEGER,
          summary TEXT,
          priority TEXT,
          status TEXT,
          sprint TEXT,
          module TEXT,
          developer TEXT,
          found_in_sprint TEXT,
          fixed_in_sprint TEXT,
          category TEXT,
          created_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de SPRINTS
        CREATE TABLE IF NOT EXISTS sprints (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sprint_name TEXT UNIQUE,
          test_cases_executed INTEGER DEFAULT 0,
          test_cases_pending INTEGER DEFAULT 0,
          bugs_found INTEGER DEFAULT 0,
          bugs_canceled INTEGER DEFAULT 0,
          bugs_solved INTEGER DEFAULT 0,
          bugs_pending INTEGER DEFAULT 0,
          percent_failed REAL DEFAULT 0,
          percent_pending_bugs REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de VERSIONES
        CREATE TABLE IF NOT EXISTS versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          version_name TEXT UNIQUE,
          sprint_id INTEGER,
          version_date TEXT,
          environment TEXT,
          test_plan TEXT,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sprint_id) REFERENCES sprints(id)
        );

        -- Tabla de DESARROLLADORES
        CREATE TABLE IF NOT EXISTS developers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE,
          canceled INTEGER DEFAULT 0,
          todo INTEGER DEFAULT 0,
          code_review INTEGER DEFAULT 0,
          in_sit INTEGER DEFAULT 0,
          ready_for_testing INTEGER DEFAULT 0,
          ready_for_uat INTEGER DEFAULT 0,
          blocked INTEGER DEFAULT 0,
          in_progress INTEGER DEFAULT 0,
          to_be_deployed INTEGER DEFAULT 0,
          total INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de MÓDULOS
        CREATE TABLE IF NOT EXISTS modules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          module_name TEXT UNIQUE,
          total_bugs INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Tabla de CATEGORÍAS
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_name TEXT UNIQUE,
          functional INTEGER DEFAULT 0,
          content_data INTEGER DEFAULT 0,
          events_iot INTEGER DEFAULT 0,
          look_feel INTEGER DEFAULT 0,
          integration INTEGER DEFAULT 0,
          configuration INTEGER DEFAULT 0,
          total INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Índices para optimizar consultas
        CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status);
        CREATE INDEX IF NOT EXISTS idx_bugs_module ON bugs(module);
        CREATE INDEX IF NOT EXISTS idx_bugs_developer ON bugs(developer);
        CREATE INDEX IF NOT EXISTS idx_bugs_sprint ON bugs(sprint);
        CREATE INDEX IF NOT EXISTS idx_bugs_priority ON bugs(priority);
      `;

      this.db.exec(schema, (err) => {
        if (err) {
          console.error('❌ Error creando schema:', err);
          reject(err);
        } else {
          console.log('✓ Schema creado correctamente');
          resolve();
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('❌ Error ejecutando SQL:', err, sql);
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('❌ Error en get():', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('❌ Error en all():', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

// Instancia singleton
let dbInstance = null;

async function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
    await dbInstance.init();
  }
  return dbInstance;
}

module.exports = { getDatabase, DatabaseManager };
