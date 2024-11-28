const Local = "http://localhost:8080/"; // URL do backend

const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoSelect = document.getElementById("tipo");
const form = document.getElementById("editarProdutoForm");
const btnDeletar = document.getElementById("btnDeletar");

async function carregarProduto() {
    try {
        const response = await fetch(`${Local}produtos/${produtoId}`);
        if (!response.ok) throw new Error("Erro ao carregar produto.");

        const produto = await response.json();
        descricaoInput.value = produto.descricao;
        valorInput.value = produto.valor_unitario;

        await carregarTipos(produto.tipo_id); 
    } catch (error) {
        console.error("Erro ao carregar produto:", error);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const produto = {
        descricao: descricaoInput.value,
        valor_unitario: parseFloat(valorInput.value),
    };

    try {
        const response = await fetch(`${Local}produtos/${produtoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(produto),
        });

        if (!response.ok) throw new Error("Erro ao salvar alterações.");

        alert("Produto atualizado com sucesso!");
        window.location.href = "produtos.html"; 
    } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        alert("Erro ao salvar as alterações do produto.");
    }
});

btnDeletar.addEventListener("click", async () => {
    const confirmacao = confirm("Você tem certeza que deseja deletar este produto?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${Local}produtos/${produtoId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Erro ao deletar produto.");

        alert("Produto deletado com sucesso!");
        window.location.href = "produtos.html";
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Erro ao deletar o produto.");
    }
});

// Inicializa a página
document.addEventListener("DOMContentLoaded", carregarProduto);
