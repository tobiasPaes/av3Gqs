const db = require('../database/db');

class Prato {
    static create(data) {
        return new Promise((resolve, reject) => {
            const { nome, preco } = data;
            db.run('INSERT INTO pratos (nome, preco) VALUES (?, ?)',
                [nome, preco],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM pratos WHERE id = ?`, [this.lastID], (err, row) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(row);
                    });
                }
            );
        });
    }


    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pratos WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pratos', [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const { nome, preco } = data;
            db.run('UPDATE pratos SET nome = ?, preco = ? WHERE id = ?',
                [nome, preco, id],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    if (this.changes === 0) {
                        resolve({ message: 'Nenhum prato encontrado com o ID fornecido ou nenhum dado para atualizar.' });
                    } else {
                        resolve({ message: 'Prato atualizado com sucesso.' });
                    }
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM pratos WHERE id = ?', [id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    resolve({ message: 'Nenhum prato encontrado com o ID fornecido.' });
                } else {
                    resolve({ message: 'Prato deletado com sucesso.' });
                }
            });
        });
    }
}

module.exports = Prato;