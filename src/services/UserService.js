import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'

export class UserService{
    async createUser(userData){
        const {name, email, password, street, neighborhood, city} = userData
        console.log(name + ' ' + password + ' ' + street + ' ' +  neighborhood + ' ' + city)

        if (!name || !email || !password || !street || !neighborhood || !city) throw new Error('Todos os campos devem ser preenchidos.')

        const queryString = 'INSERT INTO usuario (id, nome, email, senha, rua, bairro, cidade) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;'

        const res = await query(queryString, [randomUUID(), name, email, await bcrypt.hash(password, 10), street, neighborhood, city])

        return res.rows[0]
    }

    async getUserById(id){
        const queryString = 'SELECT id, nome, email, rua, bairro, cidade FROM usuario WHERE id = $1;'

        const res = await query(queryString, [id])

        return res.rows[0]
    }

    async getAllUsers(){
        const queryString = 'SELECT * FROM usuario;'

        const res = await query(queryString)

        return res.rows
    }

    async deleteUser(id){
        const queryString = 'DELETE FROM usuario WHERE id = $1 RETURNING *'

        const res = await query(queryString, [id])

        return res.rows[0]
    }

    async updateUser(data, id){
        const keys = Object.keys(data)
        const values = Object.values(data)

        if (keys.length == 0)
            throw new Error('Nenhum campo para atualizar.')

        const setQuery = keys.map((key, i) => `${key} = $${i+1}`).join(', ')
        const queryString = `UPDATE usuario SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING id, nome, email`

        const res = await query(queryString, [...values, id])

        return res.rows[0]
    }
}