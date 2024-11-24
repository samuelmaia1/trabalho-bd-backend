import express from 'express'
import { ProductService } from '../services/ProductService.js'

const router = express.Router()
const service = new ProductService()

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(await service.getAllProducts())
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})

router.post('/criar', async (req, res) => {
    try {
        return res.status(201).json(await service.createProduct(req.body))
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})

export default router