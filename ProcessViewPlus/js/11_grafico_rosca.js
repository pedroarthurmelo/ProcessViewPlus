document.addEventListener('DOMContentLoaded', function () {
    // Recuperar os dados do localStorage
    const roscaChartData = JSON.parse(localStorage.getItem('roscaChartData'));

    if (roscaChartData) {
        // Criar o FormData com os parâmetros necessários
        const formData = new FormData();
        formData.append('data_inicio', roscaChartData.data_inicio);
        formData.append('hora_inicio', roscaChartData.hora_inicio);
        formData.append('data_fim', roscaChartData.data_fim);
        formData.append('hora_fim', roscaChartData.hora_fim);

        roscaChartData.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        // Fazer requisição ao backend
        fetch('../php/11_grafico_rosca.php', { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (!data.datasets || data.datasets.length === 0) {
                    alert(data.message || 'Nenhum dado encontrado!');
                    return;
                }

                // Configurar o gráfico de rosca
                const ctx = document.getElementById('roscaChartCanvas').getContext('2d');

                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset) => ({
                            label: dataset.label,
                            data: dataset.data,
                            backgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                            ],
                            borderColor: '#fff',
                            borderWidth: 2
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        return `${label}: ${value}`;
                                    }
                                }
                            }
                        }
                    }
                });

                // Atualizar os dados no localStorage
                localStorage.setItem('roscaChartData', JSON.stringify(roscaChartData));
            })
            .catch(error => console.error('Erro ao gerar gráfico de rosca:', error));
    }
});
