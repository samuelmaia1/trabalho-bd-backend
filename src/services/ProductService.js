import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'

export class ProductService{
    async createProduct(data){
        const {description, unitValue, weigth, type} = data
        const queryString = 'INSERT INTO produto (id, descricao, valor_unitario, peso, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *'

        const res = await query(queryString, [randomUUID(), description, unitValue, weigth, type])

        return res.rows[0]
    }

    async getAllProducts(){
        const queryString = 'SELECT * FROM produto;'

        const res = await query(queryString)

        return res.rows
    }
}