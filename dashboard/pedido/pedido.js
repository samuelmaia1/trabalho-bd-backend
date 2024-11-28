const local = "http://localhost:8080/";
const params = new URLSearchParams(window.location.search);
const pedidoId = params.get("id");

// Fetch and display order details
async function carregarDetalhesPedido() {
    const pedidoDetailsContainer = document.getElementById("pedidoDetails");

    try {
        const response = await fetch(`${local}pedidos/${pedidoId}`);
        if (!response.ok) throw new Error("Erro ao buscar os detalhes do pedido.");

        const pedido = await response.json();
        const { id, id_usuario, valor_produtoa, valor_frete, valor_total, data, id_forma_pagamento, endereco_entrega, status, products } = pedido;

        const productList = products.length
            ? products.map(p => `<li>${p}</li>`).join("")
            : "<li>Nenhum produto encontrado</li>";

        pedidoDetailsContainer.innerHTML = `
            <h2>Pedido ID: ${id}</h2>
            <p><strong>Usuário ID:</strong> ${id_usuario}</p>
            <p><strong>Endereço de Entrega:</strong> ${endereco_entrega}</p>
            <p><strong>Valor do Produto:</strong> R$${valor_produtoa.toFixed(2)}</p>
            <p><strong>Valor do Frete:</strong> R$${valor_frete.toFixed(2)}</p>
            <p><strong>Valor Total:</strong> R$${valor_total.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date(data).toLocaleDateString()}</p>
            <p><strong>Forma de Pagamento:</strong> ${id_forma_pagamento}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Produtos:</strong></p>
            <ul>${productList}</ul>
        `;
    } catch (error) {
        console.error("Erro ao carregar os detalhes do pedido:", error);
        pedidoDetailsContainer.innerHTML = `<p>Erro ao carregar os detalhes do pedido.</p>`;
    }
}

// Delete order
document.getElementById("deletePedido").addEventListener("click", async () => {
    const confirmDelete = confirm("Tem certeza de que deseja deletar este pedido?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${local}pedidos/${pedidoId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Pedido deletado com sucesso!");
            window.location.href = "./../perfil/usuarios.html"; 
        } else {
            const error = await response.json();
            alert(`Erro ao deletar pedido: ${error.message || "Erro desconhecido"}`);
        }
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
        alert("Erro interno ao tentar deletar o pedido. Verifique o console para mais detalhes.");
    }
});



// Fetch products and populate the dropdown
async function carregarProdutos() {
    const productDropdown = document.getElementById("productId");
    try {
        const response = await fetch(`${local}produtos/`);
        if (!response.ok) throw new Error("Erro ao buscar produtos.");
        
        const produtos = await response.json();
        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = `${produto.nome} - R$${produto.preco.toFixed(2)}`;
            productDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

async function carregarProdutos() {
    const selectElement = document.getElementById("productId");
    try {
        const response = await fetch(`${local}produtos/`);
        if (!response.ok) throw new Error("Erro ao buscar produtos.");

        const produtos = await response.json();
        selectElement.innerHTML = '<option selected>Selecione um produto</option>';
        produtos.forEach((produto) => {
            selectElement.innerHTML += `<option value="${produto.id}">${produto.descricao} - R$${produto.valor_unitario.toFixed(2)}</option>`;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        selectElement.innerHTML =
            '<option disabled>Erro ao carregar produtos</option>';
    }
}


document.getElementById("addItemForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const productId = document.getElementById("productId").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (!productId || quantity <= 0) {
        alert("Selecione um produto e insira uma quantidade válida.");
        return;
    }

    try {
        const response = await fetch(`${local}pedidos/${pedidoId}/itens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
            alert("Item adicionado com sucesso!");
            carregarDetalhesPedido();
        } else {
            const error = await response.json();
            alert(`Erro ao adicionar item: ${error.message || "Erro desconhecido"}`);
        }
    } catch (error) {
        console.error("Erro ao adicionar item:", error);
        alert("Erro interno ao tentar adicionar item ao pedido.");
    }
});



async function deletarItem(orderId, productId) {
    const confirmDelete = confirm("Tem certeza de que deseja remover este item do pedido?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${local}pedidos/${orderId}/itens/${productId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            const updatedOrder = await response.json();
            alert("Item removido com sucesso!");
            atualizarDetalhesPedido(updatedOrder); // Update the displayed order details
        } else {
            const error = await response.json();
            alert(`Erro ao remover item: ${error.error || "Erro desconhecido"}`);
        }
    } catch (error) {
        console.error("Erro ao remover item:", error);
        alert("Erro interno ao tentar remover o item.");
    }
}

carregarDetalhesPedido();
carregarProdutos();

carregarDetalhesPedido();
