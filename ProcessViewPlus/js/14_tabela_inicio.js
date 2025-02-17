document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar dados do PHP
    fetch('../php/0.73_tabela.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#pivot-table tbody');

            if (data.error) {
                console.error(data.error);
                return;
            }

            // Preenchendo a tabela com os dados retornados
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.DataHora}</td>
                    <td>${row.nome_ambiente}</td>
                    <td>${row.ds_Classe}</td>
                    <td>${row.ds_Sufixo || '-'}</td>
                    <td>${row.ds_TipoVariavel || '-'}</td>
                    <td>${row.ds_variavel}</td>
                    <td>${row.Value}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});