const local = "http://localhost:8080/";

async function fetchRecentChanges() {
    try {
        const response = await fetch(`${local}recent-changes`); 
        console.log('Fetch response:', response); 

        if (!response.ok) {
        }

        const changes = await response.json();
        console.log('Changes:', changes); 
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
        list.innerHTML = '<li class="list-group-item">Error.</li>';
    }
}












fetchProdutos();
fetchUsuarios();
fetchRecentChanges();
setInterval(fetchRecentChanges, 1000);
