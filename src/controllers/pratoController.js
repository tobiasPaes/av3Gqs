const Prato = require('../models/prato');

class PratoController {
    static async create(req, res) {
        try {
            const { nome, preco } = req.body;

            if (!nome || !preco) {
                return res.status(400).json({ error: 'Nome e preço são obrigatórios para o prato.' });
            }
            if (typeof preco !== 'number' || preco <= 0) {
                return res.status(400).json({ error: 'O preço deve ser um número positivo.' });
            }

            const novoPrato = await Prato.create({ nome, preco });
            res.status(201).json({
                message: 'Prato criado com sucesso!',
                prato: novoPrato
            });
        } catch (error) {
            console.error('Erro ao criar prato:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao criar prato.' });
        }
    }

    static async findAll(req, res) {
        try {
            const pratos = await Prato.findAll();
            res.status(200).json(pratos);
        } catch (error) {
            console.error('Erro ao buscar pratos:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar pratos.' });
        }
    }

    static async findById(req, res) {
        try {
            const { id } = req.params;
            const prato = await Prato.findById(id);

            if (!prato) {
                return res.status(404).json({ error: 'Prato não encontrado.' });
            }
            res.status(200).json(prato);
        } catch (error) {
            console.error('Erro ao buscar prato por ID:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao buscar prato.' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
            }
            if (data.preco !== undefined && (typeof data.preco !== 'number' || data.preco <= 0)) {
                return res.status(400).json({ error: 'O preço deve ser um número positivo.' });
            }

            const result = await Prato.update(id, data);

            if (result.message.includes('Nenhum prato encontrado') || result.message.includes('nenhum dado para atualizar')) {
                return res.status(404).json({ message: result.message });
            }

            res.status(200).json({ message: 'Prato atualizado com sucesso!', updated_id: id });
        } catch (error) {
            console.error('Erro ao atualizar prato:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao atualizar prato.' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await Prato.delete(id);

            if (result.message.includes('Nenhum prato encontrado')) {
                return res.status(404).json({ message: result.message });
            }

            res.status(200).json({ message: 'Prato deletado com sucesso!', deleted_id: id });
        } catch (error) {
            console.error('Erro ao deletar prato:', error);
            res.status(500).json({ error: 'Erro interno do servidor ao deletar prato.' });
        }
    }
}

module.exports = PratoController;