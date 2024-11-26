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
        return res.status(201).json(await service.createProduct(req.body))
    } catch (error) {
        return res.status(500).json({erro: error.message})
    }
})

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

/**Pegar baseado no tipo de prdutos */
router.get('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await service.getProductById(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Erro interno ao obter produto.' });
    }
});

export default router