import express from 'express'
import { ProductService } from '../services/ProductService.js'

const router = express.Router()
const service = new ProductService()


/**Todos os produtos */
router.get('/', async (req, res) => {
    try {
        return res.status(200).json(await service.getAllProducts())
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})

/** pegar produto pelo ID */
router.get('/:id', async (req, res) => {
    try {
        return res.status(200).json(await service.getProductById(req.params.id))
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})


/**Criar produto */
router.post('/criar', async (req, res) => {
    try {
        const result = await service.createProduct(req.body);
        console.log('API Response:', result);
        return res.status(201).json(result);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ erro: error.message });
    }
});


/**Atualizar informacoes do produto */
router.put('/:id', async (req, res) => {
    try {
        return res.status(200).json(await service.updateProduct(req.body, req.params.id))
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})

/**deletar produto */
router.delete('/:id', async (req, res) => {
    try {
        return res.status(200).json(await service.deleteProduct(req.params.id))
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})



export default router