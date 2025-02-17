document.addEventListener('DOMContentLoaded', function () {
    const pieChartData = JSON.parse(localStorage.getItem('pieChartData'));

    if (!pieChartData) {
        console.error('Não há dados para o gráfico de pizza');
        return;
    }

    function fetchPieChartData() {
        const formData = new FormData();
        formData.append('data_inicio', pieChartData.data_inicio);
        formData.append('hora_inicio', pieChartData.hora_inicio);
        formData.append('data_fim', pieChartData.data_fim);
        formData.append('hora_fim', pieChartData.hora_fim);

        pieChartData.variaveis_selecionadas.forEach(variavel => {
            formData.append('variaveis_selecionadas[]', variavel);
        });

        return fetch('../php/4_grafico_pizza.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da rede');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                return data;
            });
    }

    function renderPieChart(chartData) {
        if (chartData.data.length === 0) {
            alert('Nenhum dado disponível para o período selecionado.');
            return;
        }

        const ctx = document.getElementById('pieChartCanvas').getContext('2d');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: chartData.colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(2);

                                return `${context.label}: ${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    fetchPieChartData()
        .then(renderPieChart)
        .catch(error => {
            console.error('Erro ao gerar gráfico:', error);
            alert('Erro ao gerar o gráfico. Verifique os dados selecionados.');
        });
});
