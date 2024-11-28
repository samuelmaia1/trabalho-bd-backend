import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'

export class ProductService{
    async createProduct(data) {
        const { descricao, valor_unitario, peso, tipo } = data;
        const queryString = `
            INSERT INTO produto (id, descricao, valor_unitario, peso, id_tipo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, descricao, valor_unitario, peso,
                      (SELECT json_build_object('id', tp.id, 'descricao', tp.descricao)
                       FROM tipo_produto tp
                       WHERE tp.id = $5) AS tipo_produto;
        `;
    
        console.log('Executing Query:', queryString);
        console.log('With Parameters:', [randomUUID(), descricao, valor_unitario, peso || 0, tipo]);
    
        const res = await query(queryString, [
            randomUUID(),
            descricao,
            valor_unitario,
            peso || 0,
            tipo,
        ]);
    
        console.log('Query Result:', res.rows);
    
        return res.rows[0];
    }
    
    

    async getAllProducts() {
        const queryString = `
            SELECT 
                produto.id,
                produto.descricao,
                produto.valor_unitario,
                produto.peso,
                tipo_produto.descricao AS tipo_descricao
            FROM 
                produto
            INNER JOIN 
                tipo_produto
            ON 
                produto.id_tipo = tipo_produto.id;
        `;
    
        const res = await query(queryString);
    
        return res.rows;
    }
    




    async updateProduct(data, id) {
        if (data.tipo) {
            data.id_tipo = data.tipo;
            delete data.tipo;
        }
    
        const keys = Object.keys(data);
        const values = Object.values(data);
    
        if (keys.length === 0)
            throw new Error('Nenhum campo foi informado');
    
        const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(',');
    
        const queryString = `
            UPDATE produto 
            SET ${setQuery} 
            WHERE id = $${keys.length + 1} 
            RETURNING id, descricao, valor_unitario, peso, id_tipo,
                      (SELECT json_build_object('id', tp.id, 'descricao', tp.descricao)
                       FROM tipo_produto tp
                       WHERE tp.id = produto.id_tipo) AS tipo_produto
        `;
    
        const res = await query(queryString, [...values, id]);
    
        if (res.rows.length === 0) throw new Error('Produto não encontrado');
    
        return res.rows[0];
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