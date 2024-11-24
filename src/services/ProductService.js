import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'

export class ProductService{
    async createProduct(data){
        const {description, unitValue, weigth, type, url} = data
        const queryString = 'INSERT INTO produto (id, descricao, valor_unitario, peso, tipo, url_imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'

        const res = await query(queryString, [randomUUID(), description, unitValue, weigth, type, url])

        return res.rows[0]
    }

    async getAllProducts(){
        const queryString = 'SELECT * FROM produto;'

        const res = await query(queryString)

        return res.rows
    }

    async updateProduct(data, id){
        const keys = Object.keys(data)
        const values = Object.values(data)

        if (keys.length === 0)
            throw new Error('Nenhum campo foi informado')

        const setQuery = keys.map((key, i) => `${key} = $${i+1}`).join(',')
        const queryString = `UPDATE produto SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING *`

        const res = await query(queryString, [...values, id])

        return res.rows[0]
    }

    async deleteProduct(id){
        const queryString = 'DELETE FROM produto WHERE id = $1 RETURNING *'

        const res = await query(queryString, [id])

        return res.rows[0]
    }

    async getProductById(id){
        const res = await query('SELECT * FROM produto WHERE id = $1', [id])

        return res.rows[0]
    }
}