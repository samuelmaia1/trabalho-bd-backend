import express from 'express'
import { OrderService } from '../services/OrderService.js'

const router = express.Router()

const service = new OrderService()

router.post('/criar', async (req, res) => {
    try {
        return res.status(201).json(await service.createOrder(req.body))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({erro: 'Erro interno ao realizar pedido. Por favor, tente novamente mais tarde.'})
    }
})

router.delete('/', async (req, res) => {
    
})

export default router