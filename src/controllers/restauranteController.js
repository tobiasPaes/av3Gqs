const Restaurante = require('../models/restaurante'); // Importa o modelo Restaurante

class RestauranteController {
    static async create(req, res) {
        try {
            const { nome, tipo_culinaria, classificacao } = req.body;

            if (!nome) {
                return res.status(400).json({ error: 'O nome do restaurante é obrigatório.' });
            }

            const novoRestaurante = await Restaurante.create({ nome, tipo_culinaria, classificacao });
            res.status(201).json({
                message: 'Restaurante criado com sucesso!',
                restaurante: novoRestaurante
            });
        } catch (error) {
            console.error('Erro ao criar restaurante:', error);
            if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: restaurantes.nome')) {
                return res.status(409).json({ error: 'Já existe um restaurante com este nome.' });
            }
            res.status(500).json({ error: 'Erro interno do servidor ao criar restaurante.' });
        }
    }

    static async findAll(req, res) {
        try {
            const restaurantes = await Restaurante.findAll();
            res.status(200).json(restaurantes);
        } catch (error) {
            console.error('Erro ao buscar restaurantes:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar restaurantes.' });
        }
    }

    static async findById(req, res) {
        try {
            const { id } = req.params;
            const restaurante = await Restaurante.findById(id);

            if (!restaurante) {
                return res.status(404).json({ error: 'Restaurante não encontrado.' });
            }
            res.status(200).json(restaurante);
        } catch (error) {
            console.error('Erro ao buscar restaurante por ID:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar restaurante.' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }

            const result = await Restaurante.update(id, data);

            if (result.message.includes('Nenhum restaurante encontrado') || result.message.includes('nenhum dado para atualizar')) {
                return res.status(404).json({ message: result.message });
            }

            res.status(200).json({ message: 'Restaurante atualizado com sucesso!', updated_id: id });
        } catch (error) {
            console.error('Erro ao atualizar restaurante:', error);
            if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: restaurantes.nome')) {
                return res.status(409).json({ error: 'Já existe outro restaurante com este nome.' });
            }
            res.status(500).json({ error: 'Erro interno do servidor ao atualizar restaurante.' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Restaurante.delete(id);

            if (result.message.includes('Nenhum restaurante encontrado')) {
                return res.status(404).json({ message: result.message });
            }

            res.status(200).json({ message: 'Restaurante deletado com sucesso!', deleted_id: id });
        } catch (error) {
            console.error('Erro ao deletar restaurante:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao deletar restaurante.' });
        }
    }
}

module.exports = RestauranteController;