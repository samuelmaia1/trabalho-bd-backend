const local = "http://localhost:8080/";

function gerarDescricaoAleatoria() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let descricao = '';
    for (let i = 0; i < 8; i++) { 
        descricao += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return descricao;
}

document.querySelector('.btn').addEventListener('click', async () => {
    const descricaoAleatoria = gerarDescricaoAleatoria(); 

    try {
        const response = await fetch(`${local}tipos-produto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descricao: descricaoAleatoria
            })
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Tipo criado com sucesso! Descrição: ${descricaoAleatoria}`);
            console.log(result);
            location.reload();
        } else {
            alert('Erro ao criar o tipo.');
            console.error('Erro:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição.');
    }
});



async function listarTipos() {
    try {
        const response = await fetch(`${local}tipos-produto`);
        if (response.ok) {
            const tipos = await response.json();

            const lista = document.getElementById('produtos-list');
            lista.innerHTML = '';

            tipos.forEach(tipo => {
                const item = document.createElement('li');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';

                item.innerHTML = `
                    <span><strong>ID:</strong> ${tipo.id} <br> <strong>Descrição:</strong> ${tipo.descricao}</span>
                `;

                item.addEventListener('click', () => {
                    window.location.href = `produtos-tipos.html?tipoId=${tipo.id}`;
                });

                lista.appendChild(item);
            });
        } else {
            console.error('Erro ao buscar tipos:', response.statusText);
            alert('Erro ao listar os tipos.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição ao listar tipos.');
    }
}






document.addEventListener('DOMContentLoaded', listarTipos);