document.addEventListener('DOMContentLoaded', () => {
    const reportTable = document.getElementById('report-table');
    const tableBody = reportTable.querySelector('tbody');
    const searchInput = document.getElementById('search-input');  // Referência ao campo de pesquisa

    const generateReport = async () => {
        const reportData = JSON.parse(localStorage.getItem('reportChartData'));

        if (!reportData) {
            alert('Erro: Nenhum dado encontrado no localStorage.');
            return;
        }

        try {
            const response = await fetch('../php/8_grafico_relatorio.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                alert('Erro ao gerar relatório: ' + errorMessage);
                return;
            }

            const data = await response.json();

            if (!data.headers || !data.data) {
                alert('Erro: Formato de dados inválido.');
                return;
            }

            // Limpa a tabela
            tableBody.innerHTML = '';
            const headerRow = reportTable.querySelector('thead tr');
            headerRow.innerHTML = '';

            // Adiciona cabeçalhos dinâmicos
            data.headers.forEach((header) => {
                const headerCell = document.createElement('th');
                headerCell.textContent = header;
                headerRow.appendChild(headerCell);
            });

            // Preenche os dados na tabela
            data.data.forEach((row) => {
                const dataRow = tableBody.insertRow();

                // Adiciona as células para cada cabeçalho
                data.headers.forEach((header, index) => {
                    const dataCell = dataRow.insertCell();
                    const valueKey = index === 0 ? 'Hora' : `col${index - 1}`;
                    dataCell.textContent = row[valueKey] ?? ''; // Trata valores nulos
                });
            });
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            alert('Erro ao gerar relatório: ' + error.message);
        }
    };


    // Gera o relatório assim que a página for carregada
    generateReport();
});
