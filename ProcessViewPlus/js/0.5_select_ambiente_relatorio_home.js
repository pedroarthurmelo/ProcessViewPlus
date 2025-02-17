document.addEventListener('DOMContentLoaded', function () {
    const ambienteSelect = document.getElementById('ambiente-select');
    const dataInicioInput = document.getElementById('data-inicio');
    const dataFimInput = document.getElementById('data-fim');
    const reportTable = document.getElementById('report-table');
    const tableBody = reportTable.querySelector('tbody');
    const tableHeader = reportTable.querySelector('thead tr');

    async function fetchEnvironments() {
        try {
            const response = await fetch('../php/0.2_get_ambientes_dashboard.php');
            if (!response.ok) throw new Error(`Erro ao buscar ambientes: ${response.statusText}`);
            const ambientes = await response.json();
            const filteredAmbientes = ambientes.filter(ambiente => 
                ambiente.nome_ambiente.startsWith('R') || ambiente.nome_ambiente.startsWith('F')
            );
            populateSelect(ambienteSelect, filteredAmbientes);
        } catch (error) {
            console.error('Erro ao carregar ambientes:', error);
        }
    }


    async function fetchClassesAndValues(ambienteId, dataInicio, dataFim) {
        try {
            let url = `../php/0.4_get_relatorio_home.php?id=${ambienteId}`;
            if (dataInicio) url += `&data_inicio=${dataInicio}`;
            if (dataFim) url += `&data_fim=${dataFim}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            const dados = await response.json();
            renderTable(dados);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    function renderTable(dados) {
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';

        if (dados.length === 0) {
            const noDataRow = tableBody.insertRow();
            const noDataCell = noDataRow.insertCell();
            noDataCell.colSpan = 4;
            noDataCell.textContent = 'Nenhum dado encontrado.';
            return;
        }

        const uniqueHeaders = [...new Set(dados.map(item => `${item.ds_Classe} (${item.ds_Sufixo || ''})`))];
        const rowsByDataHora = dados.reduce((acc, row) => {
            if (!acc[row.DataHora]) acc[row.DataHora] = {};
            acc[row.DataHora][`${row.ds_Classe} (${row.ds_Sufixo || ''})`] = row.Value;
            return acc;
        }, {});

        const dataHoraHeader = document.createElement('th');
        dataHoraHeader.textContent = 'DataHora';
        tableHeader.appendChild(dataHoraHeader);

        uniqueHeaders.forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            tableHeader.appendChild(headerCell);
        });

        Object.keys(rowsByDataHora).forEach(dataHora => {
            const dataRow = tableBody.insertRow();
            const dataHoraCell = dataRow.insertCell();
            dataHoraCell.textContent = dataHora;

            uniqueHeaders.forEach(header => {
                const dataCell = dataRow.insertCell();
                const value = rowsByDataHora[dataHora][header];
                dataCell.textContent = value !== undefined ? value : '-';
            });
        });
    }

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">Selecione um Ambiente</option>';
        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.id;
            option.textContent = optionData.nome_ambiente;
            selectElement.appendChild(option);
        });
    }

    fetchEnvironments();
    [ambienteSelect, dataInicioInput, dataFimInput].forEach(input => {
        input.addEventListener('change', () => {
            const ambienteId = ambienteSelect.value;
            const dataInicio = dataInicioInput.value || null;
            const dataFim = dataFimInput.value || null;
            if (ambienteId) fetchClassesAndValues(ambienteId, dataInicio, dataFim);
        });
    });
});
