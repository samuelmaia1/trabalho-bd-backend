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


  async function fetchUsuarios() {
    try {
        const response = await fetch(`${local}usuarios`);
        console.log('Fetch response:', response); 

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const usuarios = await response.json();
        console.log('Usuarios:', usuarios); 
        const list = document.getElementById('usuarios-list');
        if (usuarios.length === 0) {
            list.innerHTML = '<li>Usuarios não encontrados.</li>';
            return;
        }

        list.innerHTML = usuarios.map(usuario => `
            <li class="list-group-item">
                <a href="./perfil.html?id=${usuario.id}">${usuario.nome} - ${usuario.email}</a>
            </li>
        `).join('');
        
    } catch (error) {
        console.error('Error ao pegar usuarios:', error);
        const list = document.getElementById('usuarios-list');
        list.innerHTML = '<li>Error ao pegar users. </li>';
    }
}



document.getElementById('createUser').addEventListener('click', async () => {

  const randomName = `User${Math.floor(Math.random() * 10000)}`;
  const randomEmail = `user${Math.floor(Math.random() * 10000)}@gmail.com`;

  const userData = {
      nome: randomName,
      senha: 'senha123', 
      email: randomEmail,
      rua: 'Rua Aleatória',
      bairro: 'Bairro Qualquer',
      cidade: 'Cidade Genérica'
  };

  try {
      const response = await fetch(`${local}usuarios/criar`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
      });

      if (response.ok) {
          const data = await response.json();
          alert('Usuário criado com sucesso: ' + JSON.stringify(data));
          location.reload();

      } else {
          const error = await response.json();
          alert('Erro ao criar usuário: ' + JSON.stringify(error));
      }
  } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro interno. Verifique o console para mais detalhes.');
  }
});


fetchUsuarios();
