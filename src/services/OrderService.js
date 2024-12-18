import query from "../db/db-config.js"
import { randomUUID } from 'node:crypto'

export class OrderService{

    /**cria um pedido */
    async createOrder(data) {
        const { paymentMode, userId, status } = data;
    
        const userRes = await query(
            `SELECT rua, bairro, cidade FROM usuario WHERE id = $1`,
            [userId]
        );
    
        if (userRes.rows.length === 0) {
            throw new Error('User not found');
        }
    
        const { rua, bairro, cidade } = userRes.rows[0];
    
        const productValue = 0;
    
        const deliveryValue = 5;
    
        const orderRes = await query(
            `INSERT INTO pedido (id_usuario, valor_produtoa, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status, id)
            VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, $8)
            RETURNING id`,
            [
                userId,
                productValue,  
                deliveryValue,
                productValue + deliveryValue,  
                paymentMode,
                `${rua}, ${bairro}, ${cidade}`, 
                status,
                randomUUID() 
            ]
        );
    
        const orderId = orderRes.rows[0].id;
    
        return this.getOrderById(orderId);
    }
    
    


    /**deleta um pedido juntamente com os itens */
    async deleteOrder(id) {
        await query(
            `DELETE FROM pedido_produtos WHERE id_pedido = $1`,
            [id]
        );

        const orderResult = await query(
            `DELETE FROM pedido WHERE id = $1 RETURNING *`,
            [id]
        );

        return orderResult.rows[0] || null;
    }

    /**Atualiza o endereco de entrega, e forma de pagamento */
    async updateOrder(orderId, newAddress, Pagamento) {
        const queryString = `
            UPDATE pedido
            SET endereco_entrega = $1, id_forma_pagamento = $2
            WHERE id = $3
            RETURNING *;
        `;

        const result = await query(queryString, [newAddress, Pagamento, orderId]);

        return result.rows[0] || null;
    }


    async Adicionaritem(orderId, item) {
        const { productId, quantity } = item;
    
        // Check if the order exists
        const orderExists = await query(`SELECT id FROM pedido WHERE id = $1`, [orderId]);
        if (orderExists.rowCount === 0) {
            return null; // Pedido não encontrado
        }
    
        // Fetch the product's unit value (valor_unitario)
        const productQuery = await query(`SELECT valor_unitario FROM produto WHERE id = $1`, [productId]);
        if (productQuery.rowCount === 0) {
            return null; // Produto não encontrado
        }
    
        const unitValue = productQuery.rows[0].valor_unitario;
    
        // Insert the product into the order
        const queryString = `
            INSERT INTO pedido_produtos (id_pedido, id_produto, quantidade, valor)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await query(queryString, [orderId, productId, quantity, unitValue * quantity]);
    
        // Update the order's total values
        await query(
            `
            UPDATE pedido
            SET valor_produtoa = valor_produtoa + $1, valor_total = valor_total + $1
            WHERE id = $2
            `,
            [unitValue * quantity, orderId]
        );
    
        return result.rows[0];
    }
    


    /**Deleta um item de um pedido */
async deleteItem(orderId, productId) {

    const itemRes = await query(
        `SELECT quantidade, valor FROM pedido_produtos WHERE id_pedido = $1 AND id_produto = $2`,
        [orderId, productId]
    );

    if (itemRes.rowCount === 0) {
        return null; 
    }

    const { quantidade, valor } = itemRes.rows[0];

    await query(
        `DELETE FROM pedido_produtos WHERE id_pedido = $1 AND id_produto = $2`,
        [orderId, productId]
    );

    await query(
        `
        UPDATE pedido
        SET 
            valor_produtoa = valor_produtoa - $1,
            valor_total = valor_total - $1
        WHERE id = $2
        `,
        [valor, orderId]
    );

    return this.getOrderById(orderId);
}




/** Obtém todos os pedidos */
async getAllOrders() {
    const ordersRes = await query(
        `SELECT id, id_usuario, valor_produtoa, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status
        FROM pedido`
    );

    if (ordersRes.rowCount === 0) {
        return []; 
    }

    const orders = ordersRes.rows;

    for (const order of orders) {
        const productsRes = await query(
            `SELECT id_produto AS productId, quantidade, valor
            FROM pedido_produtos
            WHERE id_pedido = $1`,
            [order.id]
        );

        order.products = productsRes.rows;
    }

    return orders;
}


/** Obtém um pedido pelo ID, incluindo produtos (usado para facilitar certos processos) */
async getOrderById(orderId) {
    const orderRes = await query(
        `SELECT id, id_usuario, valor_produtoa, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status
        FROM pedido
        WHERE id = $1`,
        [orderId]
    );

    if (orderRes.rowCount === 0) {
        return null; // Pedido não encontrado
    }

    const order = orderRes.rows[0];

    const productsRes = await query(
        `SELECT id_produto AS productId, quantidade, valor
        FROM pedido_produtos
        WHERE id_pedido = $1`,
        [orderId]
    );

    order.products = productsRes.rows;

    return order;
}



/** Obtém todos os pedidos de um usuário */
async getOrdersByUserId(userId) {
    const ordersRes = await query(
        `SELECT id, id_usuario, valor_produtoa, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status
        FROM pedido
        WHERE id_usuario = $1`,
        [userId]
    );

    if (ordersRes.rowCount === 0) {
        return []; 
    }

    const orders = ordersRes.rows;

    for (const order of orders) {
        const productsRes = await query(
            `SELECT id_produto AS productId, quantidade, valor
            FROM pedido_produtos
            WHERE id_pedido = $1`,
            [order.id]
        );

        order.products = productsRes.rows;
    }

    return orders;
}




/** Atualiza o status de um pedido */
async updateOrderStatus(orderId, newStatus) {
    const queryString = `
        UPDATE pedido
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;

    const result = await query(queryString, [newStatus, orderId]);

    if (result.rowCount === 0) {
        return null; // Pedido não encontrado
    }

    return result.rows[0];
}


/** Calcula e atualiza o valor do frete de um pedido */
async calculateShipping(orderId, shippingDetails) {
    const orderRes = await query(
        `SELECT id, valor_produtoa FROM pedido WHERE id = $1`,
        [orderId]
    );

    if (orderRes.rowCount === 0) {
        return null; 
    }

    const order = orderRes.rows[0];
    const { valor_produtos: productValue } = order;

    const shippingCost = productValue > 100 ? 0 : 15; 

    await query(
        `
        UPDATE pedido
        SET valor_frete = $1, valor_total = valor_produtoa + $1
        WHERE id = $2
        `,
        [shippingCost, orderId]
    );

    return this.getOrderById(orderId);
}



}