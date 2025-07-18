const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS restaurantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                tipo_culinaria TEXT,
                classificacao FLOAT
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela restaurantes:', err.message);
            } else {
                // console.log('Tabela restaurantes criada com sucesso.');
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS pratos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar a tabela pratos:', err.message);
            } else {
                // console.log('Tabela pratos criada com sucesso.');
            }
        });
    }
});

module.exports = db;