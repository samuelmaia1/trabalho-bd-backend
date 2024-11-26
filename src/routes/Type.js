import express from 'express';
import { TiposProdutos } from './../services/tipoService.js'


const router = express.Router();
const service = new TiposProdutos();

// Criar tipo de produto
router.post('/tipos-produto', async (req, res) => {
    try {
        const { descricao } = req.body;
        if (!descricao) {
            return res.status(400).json({ error: 'O campo "descricao" é obrigatório' });
        }
        const tipo = await service.createTipo(req.body);
        return res.status(201).json(tipo);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao criar tipo de produto.' });
    }
});

// Deletar tipo de produto
router.delete('/tipos-produto/:descricao', async (req, res) => {
    try {
        const { descricao } = req.params;
        const tipo = await service.deletarTipo(descricao);
        if (!tipo) {
            return res.status(404).json({ error: 'Tipo de produto não encontrado' });
        }
        return res.status(200).json(tipo);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao deletar tipo de produto.' });
    }
});

// Listar tipos de produto
router.get('/tipos-produto', async (req, res) => {
    try {
        const tipos = await service.getTodosTipos();
        return res.status(200).json(tipos);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao listar tipos de produto.' });
    }
});

// Obter tipo de produto por ID
router.get('/tipos-produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await service.getProdutoID(id);
        if (!tipo) {
            return res.status(404).json({ error: 'Tipo de produto não encontrado' });
        }
        return res.status(200).json(tipo);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao buscar tipo de produto.' });
    }
});

export default router;
