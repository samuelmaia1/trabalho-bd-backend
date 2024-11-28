const Local = "http://localhost:8080/"; 

async function listarPagamentos() {
    try {
        const response = await fetch(`${Local}pagamentos`);
        if (response.ok) {
            const pagamentos = await response.json();

            const lista = document.getElementById('pagamentos-list');
            lista.innerHTML = '';

            if (pagamentos.length > 0) {
                pagamentos.forEach(pagamento => {
                    const item = document.createElement('li');
                    item.className = 'list-group-item';
                    item.innerHTML = `
                        <strong>ID:</strong> ${pagamento.id} <br>
                        <strong>Descrição:</strong> ${pagamento.descricao}
                    `;
                    lista.appendChild(item);
                });
            } else {
                lista.innerHTML = '<li class="list-group-item">Nenhuma forma de pagamento encontrada.</li>';
            }
        } else {
            console.error('Erro ao buscar pagamentos:', response.statusText);
            alert('Erro ao listar as formas de pagamento.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao buscar formas de pagamento.');
    }
}

document.addEventListener('DOMContentLoaded', listarPagamentos);