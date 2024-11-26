import express from 'express';
import { OrderService } from '../services/OrderService.js';

const router = express.Router();
const service = new OrderService();

router.post('/', async (req, res) => {
    try {
        return res.status(201).json(await service.createOrder(req.body));
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao criar pedido.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await service.deleteOrder(id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.status(200).json(deletedOrder);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao deletar pedido.' });
    }
});

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(await service.getAllOrders());
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao obter pedidos.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { endereco_entrega, id_forma_pagamento } = req.body;
        const updatedOrder = await service.updateOrder(id, endereco_entrega, id_forma_pagamento);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao atualizar pedido.' });
    }
});

router.post('/:id/itens', async (req, res) => {
    try {
        const { id } = req.params;
        return res.status(201).json(await service.Adicionaritem(id, req.body));
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao adicionar item ao pedido.' });
    }
});

router.delete('/:id/itens/:id_produto', async (req, res) => {
    try {
        const { id, id_produto } = req.params;
        const updatedOrder = await service.deleteItem(id, id_produto);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido ou item não encontrado' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao remover item do pedido.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await service.getOrderById(id);
        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao obter pedido.' });
    }
});

router.get('/usuarios/:id/pedidos', async (req, res) => {
    try {
        const { id } = req.params;
        return res.status(200).json(await service.getOrdersByUserId(id));
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao obter pedidos do usuário.' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await service.updateOrderStatus(id, status);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao atualizar status do pedido.' });
    }
});

router.post('/:id/calcular-frete', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOrder = await service.calculateShipping(id, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao calcular frete.' });
    }
});

export default router;
