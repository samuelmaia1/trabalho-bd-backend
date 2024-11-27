const local = "http://localhost:8080/";
const params = new URLSearchParams(window.location.search);
const userId = params.get('id'); 
console.log('User ID:', userId);

fetch(`${local}usuarios/${userId}`) 
  .then((response) => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados do usuário');
    }
    return response.json();
  })
  .then((data) => {
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = `
      <h1>${data.nome}</h1>
      <p><span><strong>Email:</strong></span> ${data.email}</p>
      <p><span><strong>Rua:</strong></span> ${data.rua}</p>
      <p><span><strong>Bairro:</strong></span> ${data.bairro}</p>
      <p><span><strong>Cidade:</strong></span> ${data.cidade}</p>
    <a href="#" class="btn btn-primary">Editar</a>

    `;
  })
  .catch((error) => {
    console.error(error);
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = `<h1>Erro ao carregar os dados do usuário</h1>`;
  });


  fetch(`${local}pedidos/usuario/${userId}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os pedidos do usuário');
    }
    return response.json();
  })
  .then((pedidos) => {
    const pedidosContainer = document.querySelector('.pedidos');

    if (pedidos.length === 0) {
      pedidosContainer.innerHTML = '<p>Sem pedidos encontrados.</p>';
      return;
    }

    pedidosContainer.innerHTML = pedidos
      .map((pedido) => `
       <div class="card" style="width: 18rem; margin-bottom: 15px;">
          <div class="card-body">
            <h5 class="card-title">Pedido ID: ${pedido.id}</h5>
            <p><strong>Valor Total:</strong> R$${pedido.valor_total.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${pedido.status}</p>
            <a href="./../pedido/pedido.html?id=${pedido.id}" class="btn btn-primary">Editar</a>
          </div>
        </div>
      `)
      .join('');
  })
  .catch((error) => {
    console.error(error);
    const pedidosContainer = document.querySelector('.pedidos');
    pedidosContainer.innerHTML = `<p>Erro ao carregar os pedidos.</p>`;
  });
