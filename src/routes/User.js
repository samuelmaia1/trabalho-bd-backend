import express from 'express'
import { UserService } from '../services/UserService.js'

const router = express.Router()
const service = new UserService()

router.get('/', async (req, res) => {
    try {
        return res.status(200).json(await service.getAllUsers())
    } catch (error) {
        return res.status(500).json({erro: 'Erro interno ao processar usuários. Por favor, tente novamente mais tarde.'})
    }
})

router.get('/:id', async (req, res) => {
    try {
        return res.status(200).json(await service.getUserById(req.params.id))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({erro: 'Erro interno ao processar usuário. Por favor, tente novamente mais tarde.'})
    }
})

router.post('/criar', async (req,res) => {
    try {
        return res.status(201).json(await service.createUser(req.body)) 
    } catch (error) {
        console.log(error.message)
        if (error.message.includes('viola a restrição de não-nulo'))
            return res.status(400).json({erro: 'Preencha todos os campos'})
        return res.status(500).json({erro: 'Erro interno. Por favor, tente novamente mais tarde.'})
    }
    
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await service.deleteUser(req.params.id)
        return res.status(204).json({ok: true, message: 'Usuário deletado com sucesso', data: deletedUser})
    } catch (error) {
        return res.status(500).json({erro: 'Erro ao excluir conta. Por favor, tente novamente mais tarde.'})
    }
})

router.put('/:id', async (req, res) => {
    try {
        return res.status(200).json(await service.updateUser(req.body, req.params.id))
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({erro: 'Erro interno. Por favor, tente novamente mais tarde.'})
    }
})

export default router