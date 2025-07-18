const request = require('supertest');
const { app } = require('../../src/app');
const db = require('../../src/database/db');

let server;

async function setupDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("DROP TABLE IF EXISTS pratos", (err) => {
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

describe('Prato API', () => {
    test('criar novo prato', async () => {
        const newPrato = {
            nome: 'Prato Teste Jest',
            preco: 29.99,
        }

        const res = await request(server)
            .post('/api/pratos')
            .send(newPrato);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Prato criado com sucesso!');
        expect(res.body.prato.nome).toEqual('Prato Teste Jest');
    });

    test('listar todos os pratos', async () => {
        const res = await request(server).get('/api/pratos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    })

    test('buscar prato por ID', async () => {
        const newPrato = {
            nome: 'Prato Teste ID',
            preco: 19.99,
        }

        const createRes = await request(server)
            .post('/api/pratos')
            .send(newPrato);

        const pratoId = createRes.body.prato.id;

        const res = await request(server).get(`/api/pratos/${pratoId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', pratoId);
        expect(res.body).toHaveProperty('nome', 'Prato Teste ID');
    });

    test('atualizar prato existente', async () => {
        const newPrato = {
            nome: 'Prato Teste Atualização',
            preco: 39.99,
        }

        const createRes = await request(server)
            .post('/api/pratos')
            .send(newPrato);

        const pratoId = createRes.body.prato.id;

        const updateData = {
            nome: 'Prato Teste Atualizado',
            preco: 34.99,
        }

        const res = await request(server)
            .put(`/api/pratos/${pratoId}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Prato atualizado com sucesso!');

        const getRes = await request(server).get(`/api/pratos/${pratoId}`);
        expect(getRes.body).toHaveProperty('nome', 'Prato Teste Atualizado');
        expect(getRes.body).toHaveProperty('preco', 34.99);
    });

    test('deletar prato existente', async () => {
        const newPrato = {
            nome: 'Prato Teste Deletar',
            preco: 25.00,
        }

        const createRes = await request(server)
            .post('/api/pratos')
            .send(newPrato);

        const pratoId = createRes.body.prato.id;

        const res = await request(server).delete(`/api/pratos/${pratoId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Prato deletado com sucesso!');

        const getRes = await request(server).get(`/api/pratos/${pratoId}`);
        expect(getRes.statusCode).toEqual(404);
    });

    test('buscar prato inexistente', async () => {
        const res = await request(server).get('/api/pratos/9999');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Prato não encontrado.');
    });

    test('não deve criar prato sem nome', async () => {
        const newPrato = {
            preco: 25.00,
        }

        const res = await request(server)
            .post('/api/pratos')
            .send(newPrato);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Nome e preço são obrigatórios para o prato.');
    });
});
