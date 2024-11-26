import query from "../db/db-config.js"
import { randomUUID } from 'node:crypto'

export class TiposProdutos {
    async createTipo(data) {
        const { descricao } = data;
        const queryString = 'INSERT INTO tipo_produto (id, descricao) VALUES ($1, $2) RETURNING *';
        const res = await query(queryString, [randomUUID(), descricao]);
        return res.rows[0];
    }


    async deletarTipo(descricao) {
        const queryString = 'DELETE FROM tipo_produto WHERE descricao = $1 RETURNING *';
        const res = await query(queryString, [descricao]);
        return res.rows[0] || null;
    }
    
    async getTodosTipos(){
        const queryString = 'SELECT * FROM tipo_produto;'

        const res = await query(queryString)

        return res.rows
    }

    async getProdutoID(id) {
        const queryString = 'SELECT * FROM tipo_produto WHERE id = $1';
        const res = await query(queryString, [id]);
        return res.rows[0] || null;
    }
    
    async getProductsByType(typeId) {
        const queryString = 'SELECT * FROM produto WHERE id_tipo = $1;';
        const res = await query(queryString, [typeId]);
        return res.rows;
    }


}