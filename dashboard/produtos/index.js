const Local = "http://localhost:8080/";



async function fetchProdutos() {
    try{
        const response = await fetch (`${Local}produtos`);
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
                    <h5 class="card-title">Produto ID: ${produto.descricao} </h5>
                    <p><strong>Descrição:</strong> ${produto.id}</p>
                    <p><strong>Valor:</strong> R$${produto.valor_unitario}</p>
                    <p><strong>Tipo:</strong> ${produto.tipo_descricao}</p>
                    <a href="./produto.html?id=${produto.id}" class="btn btn-primary">Editar</a>
                </div>
            </div>
        `).join('');
        
        
        

    } catch(error){ 
        console.error('Error ao pegar usuarios:', error);
        const list = document.getElementById('produtos-list');
        list.innerHTML = '<li>Error ao pegar produtos. </li>';
    }


}



async function carregarTipos() {
    const selectElement = document.getElementById('tipoSelect');
    try {
        const response = await fetch(`${Local}tipos-produto`);
        if (!response.ok) throw new Error('Erro ao carregar tipos');
        
        const tipos = await response.json();
        selectElement.innerHTML = '';
        selectElement.innerHTML += `<option selected>Selecione um tipo</option>`;
        tipos.forEach(tipo => {
            selectElement.innerHTML += `<option value="${tipo.id}">${tipo.descricao}</option>`;
        });
    } catch (error) {
        console.error('Erro ao buscar tipos:', error);
        selectElement.innerHTML = `<option disabled>Erro ao carregar tipos</option>`;
    }
}


async function adicionarProduto() {
    const selectElement = document.getElementById('tipoSelect');
    const tipoSelecionado = selectElement.value;

    if (!tipoSelecionado || tipoSelecionado === 'Selecione um tipo') {
      alert('Por favor, selecione um tipo válido.');
      return;
    }

    const produto = {
      descricao: 'Produto Gerado',
      valor_unitario: 2.4, 
      peso: 20, 
      tipo: tipoSelecionado
    };

    try {
      const response = await fetch(`${Local}produtos/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      });

      if (!response.ok) throw new Error('Erro ao criar produto');
      const result = await response.json();
      console.log('Produto criado com sucesso:', result);
      alert('Produto adicionado com sucesso!');
      location.reload();

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto. Consulte o console para detalhes.');
    }
  }

  document.getElementById('adicionarBtn').addEventListener('click', adicionarProduto);

;

async function deletarProduto(produtoId) {
    const confirmacao = confirm("Você tem certeza que deseja deletar este produto?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${Local}produtos/${produtoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erro ao deletar produto. Status: ${response.status}`);
        }

        alert('Produto deletado com sucesso!');
        fetchProdutos(); 
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Não foi possível deletar o produto.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
    carregarTipos();
});
