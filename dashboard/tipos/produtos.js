const local = "http://localhost:8080/";

// Extrai o `tipoId` da URL corretamente
const urlParams = new URLSearchParams(window.location.search);
const tipoId = urlParams.get('tipoId'); // Busca a chave `tipoId`

if (!tipoId) {
    alert('ID do tipo não encontrado na URL.');
    window.location.href = './tipos.html'; // Redireciona caso não tenha o tipoId
}

// Função para buscar os produtos do tipo
async function listarProdutosPorTipo() {
    try {
        const response = await fetch(`${local}tipos-produto/produtos/${tipoId}`);
        if (response.ok) {
            const produtos = await response.json();

            // Exibir produtos na lista
            const lista = document.getElementById('produtos-list');
            lista.innerHTML = '';

            if (produtos.length === 0) {
                lista.innerHTML = '<li class="list-group-item">Nenhum produto associado a este tipo.</li>';
            } else {
                produtos.forEach(produto => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item';

                    item.innerHTML = `
                        <strong>Descrição:</strong> ${produto.descricao} <br>
                        <strong>Valor Unitário:</strong> R$ ${produto.valor_unitario.toFixed(2)} <br>
                        <strong>Peso:</strong> ${produto.peso} kg
                    `;

                    lista.appendChild(item);
                });
            }
        } else {
            console.error('Erro ao buscar produtos:', response.statusText);
            alert('Erro ao listar os produtos.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao buscar produtos.');
    }
}

// Função para deletar o tipo
async function deletarTipo() {
    const confirmacao = confirm('Tem certeza que deseja deletar este tipo?');
    if (!confirmacao) return;

    try {
        const response = await fetch(`${local}tipos-produto/${tipoId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Tipo deletado com sucesso!');
            window.location.href = './tipos.html'; // Redireciona para a página de tipos
        } else {
            console.error('Erro ao deletar tipo:', response.statusText);
            alert('Erro ao deletar o tipo.');
        }
    } catch (error) {
        console.error('Erro ao deletar tipo:', error);
        alert('Erro ao deletar o tipo.');
    }
}

// Adiciona o evento ao botão de deletar
document.getElementById('delete-btn').addEventListener('click', deletarTipo);

// Carrega os produtos ao carregar a página
document.addEventListener('DOMContentLoaded', listarProdutosPorTipo);
