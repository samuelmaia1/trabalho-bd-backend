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

    async getUserOrders(id){
        const selectQuery = `
            SELECT 
            p.id AS pedido_id,
            p.valor_produtos,
            p.valor_frete,
            p.valor_total,
            p.data,
            p.endereco_entrega,
            p.status,
            u.id AS usuario_id,
            u.nome AS usuario_nome,
            u.email AS usuario_email,
            p.id_forma_pagamento,  -- Forma de pagamento está na tabela pedido
            pr.id AS produto_id,
            pr.descricao AS produto_descricao,
            pp.quantidade AS produto_quantidade,
            pp.valor AS produto_valor
            FROM pedido p
            JOIN usuario u ON p.id_usuario = u.id
            JOIN pedido_produtos pp ON p.id = pp.id_pedido
            JOIN produto pr ON pp.id_produto = pr.id
            WHERE u.id = $1;
        `

        const {rows} = await query(selectQuery, [id])

        if (rows.length === 0)
            throw new Error('Produto não encontrado')

        console.log(rows[0])

        let pedidos = [];
    let currentOrderId = null;
    let currentOrder = null;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        if (currentOrderId !== row.pedido_id) {
            if (currentOrder) {
                pedidos.push(currentOrder);
            }

            currentOrder = {
                id: row.pedido_id,
                user: {
                    id: row.usuario_id,
                    name: row.usuario_nome,
                    email: row.usuario_email,
                },
                productsValue: row.valor_produtos,
                deliveryValue: row.valor_frete,
                totalValue: row.valor_total,
                date: row.data,
                paymentMode: row.id_forma_pagamento,
                deliveryAddress: row.endereco_entrega,
                status: row.status,
                products: [],
            };

            currentOrderId = row.pedido_id;
        }
            currentOrder.products.push({
                id: row.produto_id,
                descricao: row.produto_descricao,
                quantidade: row.produto_quantidade,
                valor: row.produto_valor,
            });
        }

        if (currentOrder) {
            pedidos.push(currentOrder);
        }

        return pedidos;
    }
}