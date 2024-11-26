import query from '../db/db-config.js'
import { randomUUID } from 'node:crypto'


export class PagamentoService {

    async createPagamento(data) {
        const { descricao } = data;
        const queryString = 'INSERT INTO forma_pagamento (id, descricao) VALUES ($1, $2) RETURNING *';
        const res = await query(queryString, [randomUUID(), descricao]);
        return res.rows[0];
    }

    async deletarPagamento(descricao) {
        const queryString = 'DELETE FROM forma_pagamento WHERE descricao = $1 RETURNING *';
        const res = await query(queryString, [descricao]);
        return res.rows[0] || null;
    }

    async getTodosPagamentos(){
        const queryString = 'SELECT * FROM forma_pagamento;'

        const res = await query(queryString)

        return res.rows
    }

}