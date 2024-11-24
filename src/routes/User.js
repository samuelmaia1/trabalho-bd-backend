import express from 'express'
import { UserService } from '../services/UserService.js'

const router = express.Router()
const service = new UserService()

router.post('/criar', async (req,res) => {
    try {
        return res.status(201).json(await service.createUser(req.body)) 
    } catch (error) {
        if (error.message == 'Todos os campos devem ser preenchidos.')
            return res.status(400).json({erro: 'Preencha todos os campos'})
    }
    
})

export default router