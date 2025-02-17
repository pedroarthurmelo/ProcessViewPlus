document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('barChart').getContext('2d');
    let chartInstance = null; // Variável para armazenar a instância do gráfico

    // Função para gerar cores aleatórias e fortes
    function generateRandomColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 156 + 100); // Valor entre 100-255
            const g = Math.floor(Math.random() * 156 + 100); // Valor entre 100-255
            const b = Math.floor(Math.random() * 156 + 100); // Valor entre 100-255
            colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`); // Cor com transparência de 0.7
        }
        return colors;
    }

    // Função para renderizar o gráfico de barras
    function renderBarChart(labels, data) {
        // Se já existe uma instância de gráfico, destrua-a antes de criar um novo
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Gera cores aleatórias para o número de barras
        const colors = generateRandomColors(data.length);

        // Criar um novo gráfico
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, // Rótulos das barras (ex.: nomes das classes)
                datasets: [{
                    label: 'Valores',
                    data: data, // Dados para o gráfico
                    backgroundColor: colors, // Cores de fundo
                    borderColor: colors.map(color => color.replace('0.7', '1')), // Bordas mais opacas
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Função para atualizar o gráfico com dados do servidor
    async function updateChart(ambienteId, dataInicio, dataFim) {
        const response = await fetch(`../php/0.3_get_data_dashboard.php?id=${ambienteId}&data_inicio=${dataInicio}&data_fim=${dataFim}`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
            const labels = data.map(item => item.ds_Classe); // Exemplo: classes
            const values = data.map(item => item.UltimoValor); // Exemplo: valores
            renderBarChart(labels, values); // Atualiza o gráfico
        }
    }

    // Atualizar o gráfico quando o ambiente for selecionado
    const ambienteSelect = document.getElementById('ambiente-select');
    ambienteSelect.addEventListener('change', () => {
        const ambienteId = ambienteSelect.value;
        const dataInicio = document.getElementById('data-inicio').value;
        const dataFim = document.getElementById('data-fim').value;

        if (ambienteId) {
            updateChart(ambienteId, dataInicio, dataFim);
        }
    });
});
