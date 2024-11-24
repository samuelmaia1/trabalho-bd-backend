import query from "../db/db-config.js"
import { randomUUID } from 'node:crypto'

export class OrderService{
    async createOrder(data){
        const {deliveryValue, paymentMode, deliveryAddress, status, products, userId} = data

        const orderRes = await query(
            `INSERT INTO pedido (id_usuario, valor_produtos, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status, id)
            VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8)
            RETURNING id`,
            [
                userId,
                products.reduce((acc, p) => acc + p.value * p.quantity, 0),
                deliveryValue,
                products.reduce((acc, p) => acc + p.value * p.quantity, 0) + deliveryValue,
                paymentMode,
                deliveryAddress,
                status,
                randomUUID()
            ]
        )

        const orderId = orderRes.rows[0].id

        for (const product of products){
            await query(
                `INSERT INTO pedido_produtos (id_pedido, id_produto, quantidade, valor)
                VALUES ($1, $2, $3, $4)`,
                [orderId, product.id, product.quantity, product.value * product.quantity]
            )
        } 

        return this.getOrderById(orderId)
    }

    async getOrderById(id){
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
            fp.descricao AS forma_pagamento,
            pr.id AS produto_id,
            pr.descricao AS produto_descricao,
            pp.quantidade AS produto_quantidade,
            pp.valor AS produto_valor
            FROM pedido p
            JOIN usuario u ON p.id_usuario = u.id
            JOIN forma_pagamento fp ON p.id_forma_pagamento = fp.id
            JOIN pedido_produtos pp ON p.id = pp.id_pedido
            JOIN produto pr ON pp.id_produto = pr.id
            WHERE p.id = $1;
        `

        const {rows} = await query(selectQuery, [id])

        if (rows.length === 0)
            throw new Error('Produto não encontrado')

        const order = {
            id: rows[0].pedido_id,
            user: {
                id: rows[0].usuario_id,
                name: rows[0].usuario_nome,
                email: rows[0].usuario_email,
            },
            productsValue: rows[0].valor_produtoa,
            deliveryValue: rows[0].valor_frete,
            totalValue: rows[0].valor_total,
            date: rows[0].data,
            paymentMode: rows[0].forma_pagamento,
            deliveryAddress: rows[0].endereco_entrega,
            status: rows[0].status,
            products: rows.map((row) => ({
                id: row.produto_id,
                descricao: row.produto_descricao,
                quantidade: row.produto_quantidade,
                valor: row.produto_valor,
            })),
        }

        return order
    }
}