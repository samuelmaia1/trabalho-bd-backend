const local = "http://localhost:8080/";
const params = new URLSearchParams(window.location.search);
const pedidoID = params.get('id'); 
console.log('pedido ID:', pedidoID);


fetch(`${local}pedidos/${pedidoID}`)

    .then ((response) =>{
        if (!response.ok){
            throw new Error('Erro ao buscar dados do pedido');
        }
        return response.json();
    })
    .then((data) => {
        const pedidosContainer = document.getElementById('pedido');
        pedidosContainer.innerHTML =`
            <h1>${data.id}</h1>
      <p><span><strong>Usuario:</strong></span> ${data.id_usuario}</p>
      <p><span><strong>Valor Produto:</strong></span> ${data.valor_produtoa}</p>
      <p><span><strong>Valor Frete:</strong></span> ${data.valor_frete}</p>
      <p><span><strong>Valor Total:</strong></span> ${data.valor_total}</p>
        <p><span><strong>Data:</strong></span> ${data.data}</p>
        <p><span><strong>Forma de pagamento:</strong></span> ${data.id_forma_pagamento}</p>


    <a href="#" class="btn btn-primary">Editar</a>
    <a href="#" class="btn btn-primary delete ">Deletar</a>

        `
    })