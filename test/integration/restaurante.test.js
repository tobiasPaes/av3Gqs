const request = require('supertest');
const { app } = require('../../src/app');
const db = require('../../src/database/db');

let server;

async function setupDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('drop table if exists restaurantes', (err) => {
                if (err) return reject(err);
            })
            db.run("DROP TABLE IF EXISTS pratos", (err) => {
                if (err) return reject(err);
            });

            db.run(`
                CREATE TABLE restaurantes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL UNIQUE,
                    tipo_culinaria TEXT,
                    classificacao FLOAT
                )
            `, (err) => {
                if (err) return reject(err);
            });

            db.run(`
                CREATE TABLE pratos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    preco REAL NOT NULL
                )
            `, (err) => {
                if (err) return reject(err);
                resolve();
            });
        })
    })
}

beforeAll(async () => {
    await setupDatabase();
    server = app.listen(0);
});

afterAll(async () => {
    if (server) {
        await server.close();
    }
});

describe('Restaurante API', () => {
    test('criar novo restaurante', async () => {
        const newRestaurant = {
            nome: 'Restaurante Teste Jest',
            tipo_culinaria: 'Brasileira',
            classificacao: 4,
        }

        const res = await request(server)
            .post('/api/restaurantes')
            .send(newRestaurant);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Restaurante criado com sucesso!');
        expect(res.body.restaurante.nome).toEqual('Restaurante Teste Jest');
    });

    test('listar todos os restaurantes', async () => {
        const res = await request(server).get('/api/restaurantes');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    })

    test('buscar restaurante por ID', async () => {
        const newRestaurant = {
            nome: 'Restaurante Teste ID',
            tipo_culinaria: 'Italiana',
            classificacao: 3,
        }

        const createRes = await request(server)
            .post('/api/restaurantes')
            .send(newRestaurant);

        const restaurantId = createRes.body.restaurante.id;

        const res = await request(server).get(`/api/restaurantes/${restaurantId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', restaurantId);
        expect(res.body).toHaveProperty('nome', 'Restaurante Teste ID');
    });

    test('atualizar restaurante existente', async () => {
        const newRestaurant = {
            nome: 'Restaurante Teste Atualização',
            tipo_culinaria: 'Mexicana',
            classificacao: 5,
        }

        const createRes = await request(server)
            .post('/api/restaurantes')
            .send(newRestaurant);

        const restaurantId = createRes.body.restaurante.id;

        const updateData = {
            nome: 'Restaurante Teste Atualizado',
            tipo_culinaria: 'Mexicana',
            classificacao: 4.5,
        }

        const res = await request(server)
            .put(`/api/restaurantes/${restaurantId}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Restaurante atualizado com sucesso!');

        const getRes = await request(server).get(`/api/restaurantes/${restaurantId}`);
        expect(getRes.body).toHaveProperty('nome', 'Restaurante Teste Atualizado');
        expect(getRes.body).toHaveProperty('classificacao', 4.5);
    });

    test('deletar restaurante existente', async () => {
        const newRestaurant = {
            nome: 'Restaurante Teste Deletar',
            tipo_culinaria: 'Chinesa',
            classificacao: 2,
        }

        const createRes = await request(server)
            .post('/api/restaurantes')
            .send(newRestaurant);

        const restaurantId = createRes.body.restaurante.id;

        const res = await request(server).delete(`/api/restaurantes/${restaurantId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Restaurante deletado com sucesso!');

        const getRes = await request(server).get(`/api/restaurantes/${restaurantId}`);
        expect(getRes.statusCode).toEqual(404);
    });

    test('buscar restaurante inexistente', async () => {
        const res = await request(server).get('/api/restaurantes/9999');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Restaurante não encontrado.');
    });

    test('não deve criar restaurante sem nome', async () => {
        const newRestaurant = {
            tipo_culinaria: 'Brasileira',
            classificacao: 4,
        }

        const res = await request(server)
            .post('/api/restaurantes')
            .send(newRestaurant);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'O nome do restaurante é obrigatório.');
    });
});
