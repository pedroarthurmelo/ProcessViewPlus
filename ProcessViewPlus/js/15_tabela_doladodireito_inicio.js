document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar dados do PHP
    fetch('../php/0.74_tabela_doladodireito.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#pivot-table2 tbody');

            if (data.error) {
                console.error(data.error);
                return;
            }

            // Preenchendo a tabela com os dados retornados
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.ds_Classe}</td>
                    <td>${row.ds_Sufixo || '-'}</td>
                    <td>${row.Value}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});