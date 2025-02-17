document.addEventListener('DOMContentLoaded', function () {
    const tabelaData = JSON.parse(localStorage.getItem('tabelaPivotData'));

    if (tabelaData) {
        fetch('../php/1_tabela_pivot.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tabelaData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao se comunicar com o servidor.');
            }
            return response.json();
        })
        .then(data => {
            updateTable(data);
            setupSearch(data); // Configura o mecanismo de pesquisa
        })
        .catch(error => {
            console.error('Erro completo:', error);
            alert('Ocorreu um erro ao gerar o relatório: ' + error.message);
        });
    } else {
        alert('Nenhum dado encontrado no localStorage.');
    }

    function updateTable(data) {
        const table = document.getElementById('pivot-table');
        const tbody = table.querySelector('tbody');

        if (tbody) {
            tbody.innerHTML = '';

            if (!data || data.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.setAttribute('colspan', '7');
                td.textContent = 'Nenhum dado encontrado para o período selecionado.';
                td.style.textAlign = 'center';
                tr.appendChild(td);
                tbody.appendChild(tr);
                return;
            }

            data.forEach(row => {
                const tr = document.createElement('tr');
                const columns = [
                    'DataHora', 'Area', 'Medida', 'Unidade', 
                    'Equipamento', 'Variavel', 'Valor'
                ];

                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = row[col] || 'N/A';
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });
        }
    }

    function setupSearch(data) {
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase();
            const filteredData = data.filter(row => {
                return Object.values(row).some(value =>
                    value && value.toString().toLowerCase().includes(filter)
                );
            });
            updateTable(filteredData);
        });
    }
});
