document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('lineChart').getContext('2d');
    let lineChartInstance = null; // Instância do gráfico de linhas

    function renderLineChart(labels, datasets) {
        if (lineChartInstance) {
            lineChartInstance.destroy();
        }
    
        lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, // Rótulos do eixo X
                datasets: datasets.map(dataset => ({
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: dataset.borderColor || 'rgba(75, 192, 192, 1)',
                    backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)', // Fundo com transparência
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true // Ativar o preenchimento da área
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valores'
                        }
                    }
                }
            }
        });
    }
    

    // Função para buscar dados do servidor
    async function fetchData(ambienteId, dataInicio, dataFim) {
        try {
            const response = await fetch(`../php/0.3_get_data_dashboard.php?id=${ambienteId}&data_inicio=${dataInicio}&data_fim=${dataFim}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                // Prepara os dados para o gráfico
                const labels = data.map(item => item.ds_Classe); // Classes como rótulos no eixo X
                const datasets = [{
                    label: 'Valores',
                    data: data.map(item => item.UltimoValor), // Últimos valores das classes
                    borderColor: 'rgba(75, 192, 192, 1)'
                }];
                renderLineChart(labels, datasets);
            } else if (data.error) {
                console.error('Erro na API:', data.error);
            } else {
                console.error('Dados inválidos recebidos:', data);
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    // Atualizar o gráfico com base nos filtros
    document.getElementById('ambiente-select').addEventListener('change', () => {
        const ambienteId = document.getElementById('ambiente-select').value;
        const dataInicio = document.getElementById('data-inicio').value || '';
        const dataFim = document.getElementById('data-fim').value || '';
        fetchData(ambienteId, dataInicio, dataFim);
    });

    // Carregar o gráfico inicial
    const ambienteId = document.getElementById('ambiente-select').value;
    const dataInicio = document.getElementById('data-inicio').value || '';
    const dataFim = document.getElementById('data-fim').value || '';
    if (ambienteId) {
        fetchData(ambienteId, dataInicio, dataFim);
    }
});
