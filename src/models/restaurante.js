const db = require('../database/db');

class Restaurante {
    static create(data) {
        return new Promise((resolve, reject) => {
            const { nome, tipo_culinaria, classificacao } = data;
            db.run('INSERT INTO restaurantes (nome, tipo_culinaria, classificacao) VALUES (?, ?, ?)',
                [nome, tipo_culinaria, classificacao],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    db.get(`SELECT * FROM restaurantes WHERE id = ?`, [this.lastID], (err, row) => {
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
            db.get('SELECT * FROM restaurantes WHERE id = ?', [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM restaurantes', [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            // Construção dinâmica da query para UPDATE
            let sets = [];
            let values = [];

            if (data.nome !== undefined) {
                sets.push('nome = ?');
                values.push(data.nome);
            }
            if (data.tipo_culinaria !== undefined) {
                sets.push('tipo_culinaria = ?');
                values.push(data.tipo_culinaria);
            }
            if (data.classificacao !== undefined) {
                sets.push('classificacao = ?');
                values.push(data.classificacao);
            }
            if (data.endereco !== undefined) {
                sets.push('endereco = ?');
                values.push(data.endereco);
            }

            if (sets.length === 0) {
                return resolve({ message: 'Nenhum dado fornecido para atualização.' });
            }

            values.push(id);

            const query = `UPDATE restaurantes SET ${sets.join(', ')} WHERE id = ?`;

            db.run(query, values, function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    resolve({ message: 'Nenhum restaurante encontrado com o ID fornecido ou nenhum dado para atualizar.' });
                } else {
                    resolve({ message: 'Restaurante atualizado com sucesso.' });
                }
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM restaurantes WHERE id = ?', [id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    resolve({ message: 'Nenhum restaurante encontrado com o ID fornecido.' });
                } else {
                    resolve({ message: 'Restaurante deletado com sucesso.' });
                }
            });
        });
    }
}

module.exports = Restaurante;