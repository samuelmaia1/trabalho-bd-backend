import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'

export class UserService{
    async createUser(userData){
        const {name, email, password, street, neighborhood, city} = userData

        if (!name || !email || !password || !street || !neighborhood || city) throw new Error('Todos os campos devem ser preenchidos.')

        const queryString = 'INSERT INTO usuario (id, nome, email, senha, rua, bairro, cidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;'

        const res = await query(queryString, [randomUUID(), name, email, await bcrypt.hash(password, 10), street, neighborhood, city])

        return res.rows[0]
    }
}