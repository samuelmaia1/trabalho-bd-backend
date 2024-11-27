const local = "http://localhost:8080/";

async function fetchRecentChanges() {
    try {
        const response = await fetch(`${local}recent-changes`); 
        console.log('Fetch response:', response); 

        if (!response.ok) {
        }

        const changes = await response.json();
        console.log('Changes:', changes); // Debug data

        const list = document.getElementById('change-list');
        if (changes.length === 0) {
            list.innerHTML = '<li class="list-group-item">Sem mudanças recentes.</li>';
            return;
        }

        list.innerHTML = changes.map(change => `
            <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">Table: ${change.table_name}</div>
                    <div><strong>Operation:</strong> ${change.operation}</div>
                    <div><strong>Timestamp:</strong> ${new Date(change.timestamp).toLocaleString()}</div>
                    <div><strong>Data:</strong> <pre>${JSON.stringify(change.changed_data, null, 2)}</pre></div>
                </div>
            </li>
            <hr>
        `).join('');
    } catch (error) {
        const list = document.getElementById('change-list');
        list.innerHTML = '<li class="list-group-item">Error fetching changes. Check console for details.</li>';
    }
}

async function fetchUsuarios() {
    try {
        const response = await fetch(`${local}usuarios`);
        console.log('Fetch response:', response); // Debug response

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const usuarios = await response.json();
        console.log('Usuarios:', usuarios); // Debug data

        const list = document.getElementById('usuarios-list');
        if (usuarios.length === 0) {
            list.innerHTML = '<li>Usuarios não encontrados.</li>';
            return;
        }

        list.innerHTML = usuarios.map(usuario => `
            <li class="list-group-item">
                <a href="./Perfil/perfil.html?id=${usuario.id}">${usuario.nome} - ${usuario.email}</a>
            </li>
        `).join('');
        
    } catch (error) {
        console.error('Error ao pegar usuarios:', error);
        const list = document.getElementById('usuarios-list');
        list.innerHTML = '<li>Error ao pegar users. </li>';
    }
}

async function fetchProdutos() {
    try{
        const response = await fetch (`${local}produtos`);
        console.log('Fetch response:', response);

        if (!response.ok){
            throw new Error("http error, Status:", response.status)
        }
        
        const Produtos = await response.json();
        console.log("Produtos:", Produtos);

        const list = document.getElementById('produtos-list');
        if (Produtos.length === 0){
            list.innerHTML = '<li>Produtos não encontrados</li>';
            return
        }

        list.innerHTML = Produtos.map(produto => `
         
             <div class="card" style="width: 18rem; margin-bottom: 15px;">
          <div class="card-body">
            <h5 class="card-title">Produto ID: ${produto.id}</h5>
            <p><strong> Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Valor:</strong> R$${produto.valor_unitario}</p>
            <p><strong>Status:</strong> ${produto.id_tipo}</p>
            <a href="#" class="btn btn-primary">Editar</a>
          </div>
        </div>
        `).join('');
        

    } catch(error){ 
        console.error('Error ao pegar usuarios:', error);
        const list = document.getElementById('produtos-list');
        list.innerHTML = '<li>Error ao pegar produtos. </li>';
    }


}
fetchProdutos();
fetchUsuarios();
fetchRecentChanges();
setInterval(fetchRecentChanges, 10000);
