import express from 'express';
import { PagamentoService } from './../services/PagamentoService.js'


const router = express.Router();
const service = new PagamentoService();


// Criar pagamento
router.post('/', async (req, res) => {
    try {
        const { descricao } = req.body;
        if (!descricao) {
            return res.status(400).json({ error: 'O campo "descricao" é obrigatório' });
        }
        const pagamento = await service.createPagamento(req.body);
        return res.status(201).json(pagamento);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao criar pagamento.' });
    }
});

// Deletar pagamento
router.delete('/:id', async (req, res) => {
    try {
        const { descricao } = req.params;
        const pagamento = await service.deletarPagamento(descricao);
        if (!pagamento) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }
        return res.status(200).json(pagamento);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao deletar pagamento.' });
    }
});

// Listar todos os pagamentos
router.get('/', async (req, res) => {
    try {
        const pagamentos = await service.getTodosPagamentos();
        return res.status(200).json(pagamentos);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao listar pagamentos.' });
    }
});


export default router;
